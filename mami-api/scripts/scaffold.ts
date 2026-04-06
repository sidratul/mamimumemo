import { ensureDir } from "https://deno.land/std@0.224.0/fs/ensure_dir.ts";
import { resolve } from "https://deno.land/std@0.224.0/path/mod.ts";

const TEMPLATE_DIR = "./scripts/templates";
const TARGET_DIR = "./src";

// Helper function to convert a string to PascalCase
function toPascalCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Helper function to convert a string to camelCase
function toCamelCase(str:string): string {
    return str.charAt(0).toLowerCase() + str.slice(1);
}

// Helper function to check if a file exists
async function fileExists(filePath: string): Promise<boolean> {
  try {
    const file = await Deno.stat(filePath);
    return file.isFile;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return false;
    }
    throw error;
  }
}

async function scaffold() {
  const args = Deno.args;
  if (args.length < 1) {
    console.error("Usage: deno run -A scripts/scaffold.ts <ModuleName>");
    console.error("Example: deno run -A scripts/scaffold.ts product");
    Deno.exit(1);
  }

  const moduleNameLower = args[0].toLowerCase();

  const moduleNamePascal = toPascalCase(moduleNameLower);
  const moduleNameCamel = toCamelCase(moduleNamePascal);
  const moduleNamePlural = moduleNameLower + 's';

  const replacements = {
    __NAME__: moduleNamePascal,
    __NAME_CAMEL__: moduleNameCamel,
    __NAME_LOWER__: moduleNameLower,
    __NAME_PLURAL__: moduleNamePlural,
    __NAME_UPPER__: moduleNameLower.toUpperCase(),
  };

  const moduleDir = resolve(TARGET_DIR, moduleNameLower);

  try {
    await ensureDir(moduleDir);
    console.log(`Created directory: ${moduleDir}`);

    for await (const dirEntry of Deno.readDir(TEMPLATE_DIR)) {
      if (dirEntry.isFile && dirEntry.name.endsWith(".tpl")) {
        const templatePath = resolve(TEMPLATE_DIR, dirEntry.name);
        let content = await Deno.readTextFile(templatePath);

        // Replace all placeholders
        for (const [placeholder, value] of Object.entries(replacements)) {
          content = content.replace(new RegExp(placeholder, "g"), value);
        }

        const newFileName = dirEntry.name.replace(".tpl", "");
        const finalFileName = `${moduleNameLower}.${newFileName}`;

        const finalFilePath = resolve(moduleDir, finalFileName);

        await Deno.writeTextFile(finalFilePath, content);
        console.log(`Created file: ${finalFilePath}`);
      }
    }

    // Create enum and constant files separately
    const enumTemplatePath = resolve(TEMPLATE_DIR, 'enum.ts.tpl');
    if (await fileExists(enumTemplatePath)) {
      let enumContent = await Deno.readTextFile(enumTemplatePath);
      for (const [placeholder, value] of Object.entries(replacements)) {
        enumContent = enumContent.replace(new RegExp(placeholder, "g"), value);
      }
      const enumFilePath = resolve(moduleDir, `${moduleNameLower}.enum.ts`);
      await Deno.writeTextFile(enumFilePath, enumContent);
      console.log(`Created file: ${enumFilePath}`);
    }

    const constantTemplatePath = resolve(TEMPLATE_DIR, 'constant.ts.tpl');
    if (await fileExists(constantTemplatePath)) {
      let constantContent = await Deno.readTextFile(constantTemplatePath);
      for (const [placeholder, value] of Object.entries(replacements)) {
        constantContent = constantContent.replace(new RegExp(placeholder, "g"), value);
      }
      const constantFilePath = resolve(moduleDir, `${moduleNameLower}.constant.ts`);
      await Deno.writeTextFile(constantFilePath, constantContent);
      console.log(`Created file: ${constantFilePath}`);
    }
    console.log(`\nModule "${moduleNamePascal}" created successfully in 'src/'!`);
    
    // Automatically update main.ts
    await updateMainTs(moduleNameLower, moduleNamePascal);

  } catch (error) {
    if (error instanceof Error) {
      console.error("An error occurred:", error.message);
    } else {
      console.error("An unknown error occurred:", error);
    }
    Deno.exit(1);
  }
}

async function updateMainTs(moduleNameLower: string, moduleNamePascal: string) {
  const mainTsPath = resolve("./main.ts");
  let mainTsContent = await Deno.readTextFile(mainTsPath);

  // Add imports
  const importResolvers = `import { resolvers as ${moduleNamePascal}Resolvers } from "@/${moduleNameLower}/${moduleNameLower}.resolver.ts";`;
  const importTypeDefs = `import { typeDefs as ${moduleNamePascal}TypeDefs } from "@/${moduleNameLower}/${moduleNameLower}.typedef.ts";`;
  
  mainTsContent = mainTsContent.replace(
    "// SCAFFOLD_IMPORT",
    `${importResolvers}\n${importTypeDefs}\n// SCAFFOLD_IMPORT`
  );

  // Add to resolvers array
  mainTsContent = mainTsContent.replace(
    "// SCAFFOLD_RESOLVER",
    `${moduleNamePascal}Resolvers,\n    // SCAFFOLD_RESOLVER`
  );

  // Add to typeDefs array
  mainTsContent = mainTsContent.replace(
    "// SCAFFOLD_TYPEDEF",
    `${moduleNamePascal}TypeDefs,\n    // SCAFFOLD_TYPEDEF`
  );

  await Deno.writeTextFile(mainTsPath, mainTsContent);
  console.log("Automatically updated main.ts with new module.");
}

scaffold();
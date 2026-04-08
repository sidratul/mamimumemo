import { GraphQLResolveInfo, Kind, SelectionNode } from "graphql";

type Projection = Record<string, 1>;

function collectSelections(
  selections: readonly SelectionNode[],
  fragments: GraphQLResolveInfo["fragments"],
  prefix = "",
  projection: Projection = {},
): Projection {
  for (const selection of selections) {
    if (selection.kind === Kind.FIELD) {
      const fieldName = selection.name.value;
      if (fieldName === "__typename") {
        continue;
      }

      const normalizedFieldName = fieldName === "id" ? "_id" : fieldName;
      const nextPath = prefix ? `${prefix}.${normalizedFieldName}` : normalizedFieldName;

      if (selection.selectionSet) {
        collectSelections(selection.selectionSet.selections, fragments, nextPath, projection);
      } else {
        projection[nextPath] = 1;
      }
      continue;
    }

    if (selection.kind === Kind.INLINE_FRAGMENT) {
      collectSelections(selection.selectionSet.selections, fragments, prefix, projection);
      continue;
    }

    if (selection.kind === Kind.FRAGMENT_SPREAD) {
      const fragment = fragments[selection.name.value];
      if (fragment) {
        collectSelections(fragment.selectionSet.selections, fragments, prefix, projection);
      }
    }
  }

  return projection;
}

export function getMongoProjection(info: GraphQLResolveInfo): Projection {
  const fieldNode = info.fieldNodes[0];
  if (!fieldNode?.selectionSet) {
    return {};
  }

  return collectSelections(fieldNode.selectionSet.selections, info.fragments);
}

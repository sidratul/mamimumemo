import { useEffect, useState } from 'react';
import { HelperText, TextInput } from 'react-native-paper';
import { Button, useToast } from '@mami/ui';

import { useSession } from '../../providers/session-provider';
import {
  checkGraphqlConnection,
  daycareRuntime,
  getDaycareAppConfig,
  resetDaycareAppConfig,
  saveDaycareAppConfig,
} from '../../services/app-config';
import { Box, Text } from '../../theme/theme';

type ServerApiSettingsProps = {
  compact?: boolean;
};

export function ServerApiSettings({ compact = false }: ServerApiSettingsProps) {
  const { signOut } = useSession();
  const { showToast } = useToast();
  const [initialUrl, setInitialUrl] = useState('');
  const [graphqlUrl, setGraphqlUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function hydrate() {
      try {
        const config = await getDaycareAppConfig();
        if (mounted) {
          setInitialUrl(config.graphqlUrl);
          setGraphqlUrl(config.graphqlUrl);
        }
      } catch (loadError) {
        if (mounted) {
          setError(loadError instanceof Error ? loadError.message : 'Gagal membaca konfigurasi server.');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    void hydrate();

    return () => {
      mounted = false;
    };
  }, []);

  async function handleCheck() {
    try {
      setError(null);
      setInfo(null);
      setIsChecking(true);
      await checkGraphqlConnection(graphqlUrl);
      setInfo('Koneksi API berhasil.');
    } catch (checkError) {
      setError(checkError instanceof Error ? checkError.message : 'Gagal menghubungi API.');
    } finally {
      setIsChecking(false);
    }
  }

  async function handleSave() {
    try {
      setError(null);
      setInfo(null);
      setIsSaving(true);
      const nextConfig = await saveDaycareAppConfig({ graphqlUrl });
      const changedServer = nextConfig.graphqlUrl !== initialUrl;

      setInitialUrl(nextConfig.graphqlUrl);
      setGraphqlUrl(nextConfig.graphqlUrl);

      if (changedServer) {
        await signOut();
        showToast({
          message: 'Server API disimpan. Silakan masuk lagi.',
          tone: 'success',
        });
        return;
      }

      setInfo('Server API disimpan.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Gagal menyimpan server API.');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleReset() {
    try {
      setError(null);
      setInfo(null);
      setIsSaving(true);
      const defaultConfig = await resetDaycareAppConfig();
      const changedServer = defaultConfig.graphqlUrl !== initialUrl;

      setInitialUrl(defaultConfig.graphqlUrl);
      setGraphqlUrl(defaultConfig.graphqlUrl);

      if (changedServer) {
        await signOut();
      }

      setInfo('Server API dikembalikan ke default.');
    } catch (resetError) {
      setError(resetError instanceof Error ? resetError.message : 'Gagal reset server API.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Box gap={compact ? 'sm' : 'md'}>
      <Box gap="xs">
        <Text variant="bodySmall" color="textSecondary" fontWeight="800">Server API</Text>
        <Text variant="bodySmall" color="textSecondary">
          {daycareRuntime.isDesktop() ? 'Desktop tersambung ke server GraphQL ini.' : 'Aplikasi web tersambung ke server GraphQL ini.'}
        </Text>
      </Box>

      <TextInput
        mode="outlined"
        label="GraphQL URL"
        value={graphqlUrl}
        disabled={isLoading || isSaving}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="url"
        placeholder="http://localhost:8000/graphql"
        onChangeText={(value) => {
          setGraphqlUrl(value);
          setError(null);
          setInfo(null);
        }}
      />

      {error ? <HelperText type="error">{error}</HelperText> : null}
      {info ? <HelperText type="info">{info}</HelperText> : null}

      <Box flexDirection="row" gap="sm">
        <Box flex={1}>
          <Button
            label={isChecking ? 'Mengecek...' : 'Tes Koneksi'}
            variant="secondary"
            disabled={isLoading || isChecking || isSaving}
            style={{ height: 44, borderRadius: 12 }}
            onPress={() => void handleCheck()}
          />
        </Box>
        <Box flex={1}>
          <Button
            label={isSaving ? 'Menyimpan...' : 'Simpan'}
            disabled={isLoading || isSaving}
            style={{ height: 44, borderRadius: 12 }}
            onPress={() => void handleSave()}
          />
        </Box>
      </Box>

      <Button
        label="Reset ke Default"
        variant="ghost"
        disabled={isLoading || isSaving}
        style={{ height: 40, borderRadius: 12 }}
        onPress={() => void handleReset()}
      />
    </Box>
  );
}

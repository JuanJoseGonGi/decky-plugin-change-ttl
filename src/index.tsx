import {
  ButtonItem,
  definePlugin,
  PanelSection,
  PanelSectionRow,
  ServerAPI,
  staticClasses,
  TextField,
  showModal,
  ConfirmModal,
} from "decky-frontend-lib";
import { VFC, useState, useEffect } from "react";
import { FaClock } from "react-icons/fa";

interface TTLValues {
  ipv4: number;
  ipv6: number;
}

const Content: VFC<{ serverAPI: ServerAPI }> = ({ serverAPI }) => {
  const [ttlValues, setTtlValues] = useState<TTLValues>({ ipv4: 0, ipv6: 0 });
  const [newTTL, setNewTTL] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const fetchTTLValues = async () => {
    const result = await serverAPI.callPluginMethod<{}, TTLValues>("get", {});
    if (result.success) {
      setTtlValues(result.result);
      setError(null);
    } else {
      setError(result.result);
    }
  };

  useEffect(() => {
    fetchTTLValues();
  }, []);

  const handleSetTTL = async () => {
    const ttl = parseInt(newTTL);
    if (isNaN(ttl) || ttl < 1 || ttl > 255) {
      setError("Invalid TTL value. Please enter a number between 1 and 255.");
      return;
    }

    const result = await serverAPI.callPluginMethod<{ ttl: number }, void>("set", { ttl });
    if (result.success) {
      fetchTTLValues();
      setNewTTL("");
      setError(null);
      showModal(
        <ConfirmModal
          strTitle="Success"
          strDescription="TTL value has been updated successfully."
          strOKButtonText="OK"
        />
      );
    } else {
      setError(result.result);
    }
  };

  const handleTTLChange = (value: string) => {
    // Only allow numeric input
    if (/^\d*$/.test(value)) {
      setNewTTL(value);
      // Clear error when user starts typing
      if (error) setError(null);
    }
  };

  return (
    <PanelSection title="Change TTL">
      <PanelSectionRow>
        <div>Current IPv4 TTL: {ttlValues.ipv4}</div>
      </PanelSectionRow>
      <PanelSectionRow>
        <div>Current IPv6 TTL: {ttlValues.ipv6}</div>
      </PanelSectionRow>
      <PanelSectionRow>
        <TextField
          label="New TTL Value (1-255)"
          value={newTTL}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTTLChange(e.target.value)}
        />
      </PanelSectionRow>
      <PanelSectionRow>
        <ButtonItem layout="below" onClick={handleSetTTL}>
          Set New TTL
        </ButtonItem>
      </PanelSectionRow>
      {error && (
        <PanelSectionRow>
          <div style={{ color: 'red' }}>{error}</div>
        </PanelSectionRow>
      )}
    </PanelSection>
  );
};

export default definePlugin((serverApi: ServerAPI) => {
  return {
    title: <div className={staticClasses.Title}>Change TTL</div>,
    content: <Content serverAPI={serverApi} />,
    icon: <FaClock />,
  };
});

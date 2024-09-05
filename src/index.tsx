import {
    ButtonItem,
    definePlugin,
    PanelSection,
    PanelSectionRow,
    ServerAPI,
    staticClasses,
    SliderField,
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
    const [newTTL, setNewTTL] = useState<number>(-1);
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
        const ttl = newTTL;
        if (isNaN(ttl) || ttl < 1 || ttl > 255) {
            setError("Invalid TTL value. Please enter a number between 1 and 255.");
            return;
        }

        const result = await serverAPI.callPluginMethod<{ ttl: number }, void>("set", { ttl });
        if (result.success) {
            fetchTTLValues();
            setNewTTL(-1);
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

    const handleTTLChange = (value: number) => {
        setNewTTL(value);
        // Clear error when user starts typing
        if (error) setError(null);
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
                <SliderField
                    value={newTTL}
                    min={1}
                    max={255}
                    step={1}
                    onChange={handleTTLChange}
                    showValue={true}
                    valueSuffix=" TTL"
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

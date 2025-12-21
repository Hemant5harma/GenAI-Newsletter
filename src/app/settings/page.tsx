import { getAiSettings } from "./actions";
import SettingsForm from "./SettingsForm";

export default async function SettingsPage() {
    const settings = await getAiSettings();

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--color-bg-primary)',
            padding: '2rem'
        }}>
            <div style={{
                maxWidth: '600px',
                margin: '0 auto'
            }}>
                {/* Header */}
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{
                        fontSize: '1.75rem',
                        fontWeight: 700,
                        marginBottom: '0.5rem'
                    }}>
                        Settings
                    </h1>
                    <p style={{ color: 'var(--color-text-secondary)' }}>
                        Configure your AI provider and API keys
                    </p>
                </div>

                <SettingsForm initialSettings={settings} />
            </div>
        </div>
    );
}

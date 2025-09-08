<x-filament-panels::page.simple>
    <form>
        {{ $this->form }}
    </form>
</x-filament-panels::page.simple>

@push('scripts')
    <script type="module">
        import { ControlClient } from './index.mjs';

        const client = new ControlClient("wss://cg025-dev.vr4more.com/room/bpl-testing/");
        let activeWebView = undefined;

        function setPoi(title) {
            console.log("Set POI "+name);
            client.setTargetPoi(title);
        }

        function setVisibility(visibilityString) {
            console.log("Set Visibility "+visibilityString);
            client.setVisibility(visibilityString);
        }

        async function createWebView(url) {
            if (activeWebView) {
                console.log("Should delete active webview", activeWebView);
                client.deleteObject(activeWebView);
                activeWebView = null;
            }

            activeWebView = await client.createWebView(url);
        }

        document.addEventListener("DOMContentLoaded", async () => {
            window.addEventListener('model-options-changed', e => {
                const groups = [
                    'Umgebung',
                    'Bahnhof',
                    'Busbahnhof - Opt3',
                    'Tunnel - Durchbruch',
                ];

                const value = e.detail[0].value;

                const result = groups.map(group => value.includes(group) ? '+' + group : '-' + group);

                setVisibility(result.join(','));
            });

            window.addEventListener('poi-selected', e => {
                const poiName = e.detail[0].value;

                setPoi(poiName);
            });

            window.addEventListener('webview-opened', e => {
                const webViewUrl = e.detail[0].value;

                createWebView(webViewUrl);
            });

            client.createPOIController();

        });
    </script>
@endpush

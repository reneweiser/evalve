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
            document.getElementById('form.variant_0').addEventListener('change', e => setVisibility(e.target.value))
            document.getElementById('form.variant_1').addEventListener('change', e => setVisibility(e.target.value))
            document.getElementById('form.poi').addEventListener('change', e => setPoi(e.target.value))
            document.getElementById('form.webview').addEventListener('change', e => createWebView(e.target.value))

            client.createPOIController();

        });
    </script>
@endpush

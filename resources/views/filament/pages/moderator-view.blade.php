<x-filament-panels::page.simple>
    <form>
        {{ $this->form }}
    </form>

    @push('scripts')
        <script type="module">
            import { ControlClient } from './commonground.mjs';

            const client = new ControlClient("wss://cg025-dev.vr4more.com/room/bpl-testing/");
            let activeWebViews = [];

            function setPoi(title) {
                console.log("Set POI " + title);
                client.setTargetPoi(title);
            }

            function reloadPois(title) {
                console.log("Reload POIs");
                client.reloadPois();
            }

            function setVisibility(visibilityString) {
                console.log("Set Visibility " + visibilityString);
                client.setVisibility(visibilityString);
            }

            function clearWebViews() {
                for (const v of activeWebViews) {
                    console.log("Should delete active webview", v);
                    client.deleteObject(v);
                }
                activeWebViews = [];
            }

            async function createWebView(url, positioningMode = 0, width=300, height=200, transform=undefined, role=undefined) {
                activeWebViews.push(await client.createWebView(url, positioningMode, width, height, transform, role));
            }
        </script>
    @endpush
</x-filament-panels::page.simple>

<x-filament-panels::page.simple>
    <form>
        {{ $this->form }}
    </form>
</x-filament-panels::page.simple>

@push('scripts')
<script type="module">
        import { ControlClient } from './index.mjs';
        var client = new ControlClient("wss://cg025-dev.vr4more.com/room/bpl-testing/");
        var activeWebViews = [];

        function setPoi(title) {
            console.log("Set POI " + title);
            client.setTargetPoi(title);
        }

        function reloadPois(title) {
            console.log("Reload POIs");
            client.reloadPois();
        }

        function setVisibility(visibilityString) {
            console.log("Set Visibility "+visibilityString);
            client.setVisibility(visibilityString);
        }

        function clearWebViews() {
            for (var v of activeWebViews) {
                console.log("Should delete active webview", v);
                client.deleteObject(v);
            }
            activeWebViews = [];
        }

        async function createWebView(url, positioningMode = 0, width=300, height=200, transform=undefined, role=undefined) {
            activeWebViews.push(await client.createWebView(url, positioningMode, width, height, transform, role));
        }
        async function createWebView1() {
            // adds a webview in front of the user
            createWebView("https://dev.vr4more.com/dan/bpl/test_content.html?userAlias=$USERNAME$&userRole=$ROLE$", 2, 160, 90);
        }
        async function createWebView2() {
            // adds a positioned webview
            createWebView("https://difu.de/projekte/bauhaus-participation-lab", 1, 220, 210, {
                position: { x:-53.68, y:2.65, z:-36.9},
                rotation: { x:0, y:-180, z:0, w:1},
                scale: { x:0.5, y:0.5, z:0.5 }
            });
        }
        async function createWebView3() {
            // adds a webview in front of the Moderator
            createWebView("https://consensive.com", 2, 160, 90, undefined, "Moderator");
        }

        window.addEventListener('poi-selected', e => {
            const poiName = e.detail[0].value;

            setPoi(poiName);
        });

        window.addEventListener('webview-opened', e => {
            const url = e.detail[0].value;

            createWebView(url, 2, 100, 100);
        });

        // document.addEventListener("DOMContentLoaded", async () => {
        //     document.getElementById("poiButton1").addEventListener("click", ()=>setPoi("0 Miniatur - Komplett Opt3"));
        //     document.getElementById("poiButton2").addEventListener("click", ()=>setPoi("1_0 Bahnhofshalle"));
        //     document.getElementById("poiReloadButton").addEventListener("click", ()=>reloadPois());
        //
        //     document.getElementById("clearWebViewsButton").addEventListener("click", ()=>clearWebViews());
        //     document.getElementById("createWebViewButton").addEventListener("click", ()=>createWebView1());
        //     document.getElementById("createWebViewButton2").addEventListener("click", ()=>createWebView2());
        //     document.getElementById("createWebViewButton3").addEventListener("click", ()=>createWebView3());
        //
        //     document.getElementById("visibility").addEventListener("input", (e)=>setVisibility(e.target.value));
        //
        //     client.createPOIController();
        // });
    </script>

    <script type="module">
        // import { ControlClient } from './index.mjs';
        //
        // const client = new ControlClient("wss://cg025-dev.vr4more.com/room/bpl-testing/");
        // let activeWebView = undefined;
        //
        // function setPoi(title) {
        //     console.log("Set POI "+name);
        //     client.setTargetPoi(title);
        // }
        //
        // function setVisibility(visibilityString) {
        //     console.log("Set Visibility "+visibilityString);
        //     client.setVisibility(visibilityString);
        // }
        //
        // async function createWebView(url) {
        //     if (activeWebView) {
        //         console.log("Should delete active webview", activeWebView);
        //         client.deleteObject(activeWebView);
        //         activeWebView = null;
        //     }
        //
        //     activeWebView = await client.createWebView(url);
        // }
        //
        // document.addEventListener("DOMContentLoaded", async () => {
        //     window.addEventListener('model-options-changed', e => {
        //         const groups = [
        //             'Umgebung',
        //             'Bahnhof',
        //             'Busbahnhof - Opt3',
        //             'Tunnel - Durchbruch',
        //         ];
        //
        //         const value = e.detail[0].value;
        //
        //         const result = groups.map(group => value.includes(group) ? '+' + group : '-' + group);
        //
        //         setVisibility(result.join(','));
        //     });
        //
        //     window.addEventListener('poi-selected', e => {
        //         const poiName = e.detail[0].value;
        //
        //         setPoi(poiName);
        //     });
        //
        //     window.addEventListener('webview-opened', e => {
        //         const webViewUrl = e.detail[0].value;
        //
        //         createWebView(webViewUrl);
        //     });
        //
        //     client.createPOIController();
        //
        // });
    </script>
@endpush

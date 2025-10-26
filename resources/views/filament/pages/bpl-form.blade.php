<x-filament-panels::page.simple>
    <form>
        {{ $this->form }}
    </form>
</x-filament-panels::page.simple>

@push('scripts')
<script type="module">
        import { ControlClient } from './commonground.mjs';

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

        function toQuaternion(vector) {
            const cx = Math.cos(vector.x * 0.5);
            const sx = Math.sin(vector.x * 0.5);
            const cy = Math.cos(vector.y * 0.5);
            const sy = Math.sin(vector.y * 0.5);
            const cz = Math.cos(vector.z * 0.5);
            const sz = Math.sin(vector.z * 0.5);

            return {
                w: cx * cy * cz - sx * sy * sz,
                x: cx * cy * cz + cx * sy * cz,
                y: sx * cy * cz + cx * sy * sz,
                z: cx * sy * cz - sx * cy * sz
            };
        }

        console.log(toQuaternion({x: 8, y: 5, z: 2}))

        window.addEventListener('poi-selected', e => {
            const poiName = e.detail[0].value;

            setPoi(poiName);
        });

        window.addEventListener('webview-opened', e => {
            const url = e.detail[0].value;

            // createWebView(url, 2, 100, 100);
            createWebView(url, 1, 200, 200, {
                position: { x:0, y:0, z:0 },
                rotation: { x:0, y:0, z:0, w:1 },
                scale: { x:0.5, y:0.5, z:0.5 }
            });
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

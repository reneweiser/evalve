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

            function eulerToQuaternion(euler) {
                // Input euler angles in radians {x, y, z}
                // Output quaternion {x, y, z, w} compatible with Unity (ZXY rotation order)

                euler.x = (euler.x * Math.PI)/180;
                euler.y = (euler.y * Math.PI)/180;
                euler.z = (euler.z * Math.PI)/180;
                const { x, y, z } = euler;

                // Half angles for calculations
                const halfX = x / 2;
                const halfY = y / 2;
                const halfZ = z / 2;

                // Calculate trigonometric values
                const cx = Math.cos(halfX);
                const sx = Math.sin(halfX);
                const cy = Math.cos(halfY);
                const sy = Math.sin(halfY);
                const cz = Math.cos(halfZ);
                const sz = Math.sin(halfZ);

                // Calculate quaternion components for ZXY rotation order
                const w = cx * cy * cz - sx * sy * sz;
                const xq = sx * cy * cz + cx * sy * sz;
                const yq = cx * sy * cz - sx * cy * sz;
                const zq = cx * cy * sz + sx * sy * cz;

                return {
                    x: xq,
                    y: yq,
                    z: zq,
                    w: w
                };
    }

            window.addEventListener('model-selected', e => {
                const value = e.detail[0].value;

                console.log('model-selected', value);
                client.setVisibility(value);
            });

            window.addEventListener('poi-selected', e => {
                const value = e.detail[0].value;

                console.log('poi-selected', value);
                client.setVisibility(value.visibility);
                client.setTargetPoi(value.poiName);
            });

            window.addEventListener('open-question', e => {
                const value = e.detail[0].value;

                console.log('open-question', value);
                createWebView(value.participantView, 1, value.billboardSettings.size.width, value.billboardSettings.size.height, {
                    position: value.billboardSettings.position,
                    rotation: value.billboardSettings.rotation,
                    scale: { x:0.5, y:0.5, z:0.5 }
                });
            });

            window.addEventListener('close-question', e => {
                const value = e.detail[0].value;

                console.log('close-question', value);
            })

            window.addEventListener('open-polling', e => {
                const value = e.detail[0].value;

                console.log('open-polling', value);
                createWebView(value.pollingView, 1, value.data.size.width, value.data.size.height, {
                    position: value.data.position,
                    rotation: eulerToQuaternion(value.data.rotation),
                    scale: { x:0.5, y:0.5, z:0.5 }
                });
            })
        </script>
    @endpush
</x-filament-panels::page.simple>

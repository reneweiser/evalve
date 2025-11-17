import {ControlClient} from './commonground';
import hash from "hash-it";

const client = new ControlClient("wss://cg025-dev.vr4more.com/room/bpl-testing/");

let activeWebViews = [];

let cache = {
    questions: {},
    pollingField: undefined,
    billboard: undefined,
    webViews: {}
};

function setPoi(title) {
    console.log("Set POI " + title);
    client.setTargetPoi(title);
}

function reloadPois(title) {
    console.log("Reload POIs!!!");
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
    const webview = await client.createWebView(url, positioningMode, width, height, transform, role);
    activeWebViews.push(webview);
    return webview;
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

window.addEventListener('refresh-pois', e => {
    reloadPois(null);
});

window.addEventListener('poi-selected', e => {
    const value = e.detail[0].value;

    console.log('poi-selected', value);
    client.setVisibility(value.visibility);
    client.setTargetPoi(value.poiName);
});

window.addEventListener('open-question', async e => {
    const value = e.detail[0].value;

    console.log('open-question', value);
    const webview = await createWebView(value.participantView, 2, value.data.width, value.data.height, {
        position: value.billboardSettings.position,
        rotation: eulerToQuaternion(value.billboardSettings.rotation),
        // scale: { x:0.5, y:0.5, z:0.5 }
    });

    cache.questions[value.billboardSettings.questionId] = webview;
});

window.addEventListener('open-webview', async e => {
    const value = e.detail[0].value;

    console.log('open-webview', value);
    const webview = await createWebView(value.url, 0, 200, 200);
    cache.questions[value.url] = webview;
});

window.addEventListener('close-webview', e => {
    const value = e.detail[0].value;

    console.log('close-webview', value);
    const question = cache.questions[value.billboardSettings.questionId];
    client.deleteObject(question)
    delete cache.questions[value.billboardSettings.questionId];
});

window.addEventListener('close-all-webviews', e => {
    console.log('close-all-webviews');
    client.deleteAllWebViews();

    cache = {
        questions: {},
        pollingField: undefined,
        billboard: undefined,
        webViews: {}
    };
});

window.addEventListener('open-polling', async e => {
    const value = e.detail[0].value;

    console.log('open-polling', value);
    const webView = await createWebView(value.pollingView, 1, value.data.size.width, value.data.size.height, {
        position: value.data.position,
        rotation: eulerToQuaternion(value.data.rotation),
        scale: {x: 0.5, y: 0.5, z: 0.5}
    });

    const pollingView = hash(value.pollingView);
    if (Object.hasOwn(cache.webViews, pollingView)) {
        client.deleteObject(cache.webViews[pollingView])
        delete cache.webViews[pollingView];
    }

    cache.webViews[pollingView] = webView;
});

window.addEventListener('close-polling', e => {
    const value = e.detail[0].value;

    const pollingView = hash(value.pollingView);
    console.log('close-polling', pollingView);
    if (Object.hasOwn(cache.webViews, pollingView)) {
        client.deleteObject(cache.webViews[pollingView])
        delete cache.webViews[pollingView];
    }
});

window.addEventListener('show-billboard', async e => {
    const value = e.detail[0].value;

    console.log('show-billboard', value);
    cache.billboard = await createWebView(value.url, 1, value.data.size.width, value.data.size.height, {
        position: value.data.position,
        rotation: eulerToQuaternion(value.data.rotation),
        scale: {x: 0.5, y: 0.5, z: 0.5}
    });
});

window.addEventListener('hide-billboard', e => {
    console.log('hide-billboard');

    if (cache.billboard) {
        client.deleteObject(cache.billboard)
        cache.billboard = undefined;
    }
});

import './style.css';
import { loadGLTF } from "./libs/loader.js";
import { mockWithImage } from "./libs/camera-mock.js";

const THREE = window.MINDAR.IMAGE.THREE;


const start = async () => {
    mockWithImage('./assets/mock-images/mock-business-card.jpg')

    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
        container: document.querySelector('#app'),
        imageTargetSrc: './assets/targets/business-card.mind'
    });
    const {renderer, scene, camera} = mindarThree;

    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
    scene.add(light);

    const businessCard = await loadGLTF('./assets/models/business-card/ar-business-card-exp.gltf');
    businessCard.scene.scale.set(0.117, 0.117, 0.117);
    businessCard.scene.position.set(0.495, -0.32, 0);
    businessCard.scene.rotation.set(89.58, 0, 0);
    businessCard.scene.userData.clickable = true;

    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(businessCard.scene);

    let el = document.querySelector('#app')

    el.addEventListener('click', (e) => {
        const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        const mouseY = -1 * ((e.clientY / window.innerHeight) * 2 - 1);
        const mouse = new THREE.Vector2(mouseX, mouseY);

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(scene.children, true);

        if (intersects.length > 0 ) {
            let o = intersects[0].object

            while (o.parent && !o.userData.clickable) {
                o = o.parent;
            }

            if(o.userData.clickable) {
                if (o === businessCard.scene) {

                }
            }
        }
    })

    await mindarThree.start();

    renderer.setAnimationLoop(() => {
        renderer.render(scene, camera);
    });
}
start();


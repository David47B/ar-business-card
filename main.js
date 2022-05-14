import './style.css';
import {loadTextures} from "./libs/loader.js";
import { mockWithImage } from "./libs/camera-mock.js";

const THREE = window.MINDAR.IMAGE.THREE;


const start = async () => {
    //mockWithImage('./assets/mock-images/mock-business-card-small.jpg')

    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
        container: document.body,
        imageTargetSrc: './assets/targets/business-card.mind'
    });
    const {renderer, scene, camera} = mindarThree;

    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
    scene.add(light);

    const [
        cardTexture,
        profileTexture,
        nameTexture,
        webTexture,
        emailTexture,
        callTexture,
        facebookTexture,
        instagramTexture,
        linkedInTexture
    ] = await loadTextures([
        './assets/business-card/business-card.png',
        './assets/business-card/db-pic.png',
        './assets/business-card/db-text.png',
        './assets/business-card/website.png',
        './assets/business-card/email.png',
        './assets/business-card/call.png',
        './assets/business-card/facebook.png',
        './assets/business-card/instagram.png',
        './assets/business-card/linked-in.png'
    ]);

    // Business card
    const cardGeometry = new THREE.PlaneGeometry(3,2);
    const cardMaterial = new THREE.MeshBasicMaterial({
        map: cardTexture
    });
    const card = new THREE.Mesh(cardGeometry, cardMaterial);

    // Profile pic
    const profilePicGeometry = new THREE.PlaneGeometry(2.9, 2.3);
    const profilePicMaterial = new THREE.MeshBasicMaterial({
        map: profileTexture,
        transparent: true
    });
    const profilePic = new THREE.Mesh(profilePicGeometry, profilePicMaterial);

    // Name
    const nameGeometry = new THREE.PlaneGeometry(3, 1.75);
    const nameMaterial = new THREE.MeshBasicMaterial({
        map: nameTexture
    });
    const name = new THREE.Mesh(nameGeometry, nameMaterial);

    // Social Icons
    const iconGeometry = new THREE.CircleGeometry(1, 32);
    const emailMaterial = new THREE.MeshBasicMaterial({
        map: emailTexture
    });
    const webMaterial = new THREE.MeshBasicMaterial({
        map: webTexture
    });
    const callMaterial = new THREE.MeshBasicMaterial({
        map: callTexture
    });
    const facebookMaterial = new THREE.MeshBasicMaterial({
        map: facebookTexture
    });
    const instagramMaterial = new THREE.MeshBasicMaterial({
        map: instagramTexture
    });
    const linkedInMaterial = new THREE.MeshBasicMaterial({
        map: linkedInTexture
    });

    const emailIcon = new THREE.Mesh(iconGeometry, emailMaterial);
    const webIcon = new THREE.Mesh(iconGeometry, webMaterial);
    const callIcon = new THREE.Mesh(iconGeometry, callMaterial);
    const facebookIcon = new THREE.Mesh(iconGeometry, facebookMaterial);
    const instagramIcon = new THREE.Mesh(iconGeometry, instagramMaterial);
    const linkedInIcon = new THREE.Mesh(iconGeometry, linkedInMaterial);

    const socialLinksGroup = new THREE.Group();
    socialLinksGroup.position.set(0.68, -0.5, 0)

    let scale = 0.12;

    webIcon.scale.set(scale, scale, scale)
    emailIcon.scale.set(scale, scale, scale)
    callIcon.scale.set(scale, scale, scale)
    facebookIcon.scale.set(scale, scale, scale)
    instagramIcon.scale.set(scale, scale, scale)
    linkedInIcon.scale.set(scale, scale, scale)

    webIcon.position.set(0, 0, 0);
    emailIcon.position.set(0.34, 0, 0);
    callIcon.position.set(0.69, 0, 0);
    facebookIcon.position.set(0, -.28, 0);
    instagramIcon.position.set(0.34, -.28, 0);
    linkedInIcon.position.set(0.69, -.28, 0);

    socialLinksGroup.add(webIcon);
    socialLinksGroup.add(emailIcon);
    socialLinksGroup.add(callIcon);
    socialLinksGroup.add(facebookIcon);
    socialLinksGroup.add(instagramIcon);
    socialLinksGroup.add(linkedInIcon);

    // Add to scene using Mind AR anchors
    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(card);
    anchor.group.add(profilePic);
    anchor.group.add(name);
    anchor.group.add(socialLinksGroup);


    card.scale.set(0.33, 0.33, 0.33)
    card.position.set(0,0,0.02)
    name.scale.set(0.33, 0.33, 0.33)
    name.position.set(0, 0, 0.01)
    profilePic.scale.set(0.33, 0.33, 0.33)
    profilePic.position.set(0,.05, 0.01)

    webIcon.userData.clickable = true;
    emailIcon.userData.clickable = true;
    callIcon.userData.clickable = true;
    facebookIcon.userData.clickable = true;
    instagramIcon.userData.clickable = true;
    linkedInIcon.userData.clickable = true;

    const externalLink = (url) => {
        let win = window.open(url, '_blank');
        win.focus()
    }

    document.body.addEventListener('click', (e) => {
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
                if (o === facebookIcon) {
                    externalLink("https://facebook.com")
                } else if (o === webIcon) {
                    externalLink("http://www.davidburbury.co.uk")
                } else if (o === emailIcon) {
                    externalLink("mailto:dave.burbury@gmail.com")
                } else if (o === callIcon) {
                    externalLink("tel:+447595660587")
                } else if (o === instagramIcon) {
                    externalLink("https://www.instagram.com/davidburbury")
                } else if (o === linkedInIcon) {
                    externalLink("https://www.linkedin.com/in/davidburbury/")
                }
            }
        }
    })

    const clock = new THREE.Clock();
    await mindarThree.start();

    anchor.onTargetFound = () => {
        renderer.setAnimationLoop(() => {
            const delta = clock.getDelta();
            const elapsed = clock.getElapsedTime();

            const profilePicPosX = Math.min(1.03, -0.1 + elapsed * 4)
            profilePic.position.set(profilePicPosX, .05, 0.01)

            const namePosY = Math.min(0.65, 0 + elapsed * 3)
            name.position.set(0, -namePosY, 0.01)

            const iconScale = scale + 0.01 * Math.sin(elapsed * 2) ;
            [webIcon, emailIcon, callIcon, facebookIcon, instagramIcon, linkedInIcon].forEach((icon) => {
                icon.scale.set(iconScale, iconScale, iconScale);
            })

            renderer.render(scene, camera);
            renderer.outputEncoding = THREE.LinearEncoding;
        });
    }

    anchor.onTargetLost = () => {
        renderer.setAnimationLoop(null)
        window.location.reload();
    }

}

start();


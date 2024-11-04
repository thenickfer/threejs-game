import { DodecahedronGeometry, Mesh, MeshPhongMaterial, Vector3 } from "three";
import GameEntity from "../entities/GameEntity";
import { randomIntInRange, randomSign } from "../utils/MathUtils";

class ShootEffect extends GameEntity {
    private _angle: number;
    private _fire = new Mesh();
    private _smoke = new Mesh();
    private _size = 0.1;
    private _effectDuration = 1;

    constructor(position: Vector3, angle: number) {
        super(position);
        this._angle = angle;
    }

    public load = async () => {
        const particleGeometry = new DodecahedronGeometry(this._size, 0);
        const smokeMaterial = new MeshPhongMaterial({
            color: 0xfafafa,
            transparent: true
        });

        const fireMaterial = new MeshPhongMaterial({ color: 0xff5900 });

        const totalParticles = randomIntInRange(4, 9);
        for (let i = 0; i < totalParticles; i++) {
            const angleOffset = Math.PI * 0.08 * Math.random() * randomSign();

            const particleSpeed = 1.75 * Math.random() * 3;

            const fireParticle = new Mesh(particleGeometry, fireMaterial);
            fireParticle.userData = {
                angle: this._angle + angleOffset,
                speed: particleSpeed
            };
            this._fire.add(fireParticle);

            const smokePositionOffset = new Vector3(
                Math.random() * this._size * randomSign(),
                Math.random() * this._size * randomSign(),
                Math.random() * this._size * randomSign()
            );
            const smokeParticle = new Mesh(particleGeometry, smokeMaterial);
            smokeParticle.position.add(smokePositionOffset);
            this._smoke.add(smokeParticle);
        }

        this._mesh.add(this._fire);
        this._mesh.add(this._smoke);
    };

    public update = (deltaT: number) => {
        this._effectDuration -= deltaT;
        if (this._effectDuration <= 0) {
            this._shouldDispose = true;
            return;
        }

        this._fire.children.forEach(e => {
            const fireParticle = e as Mesh;
            const angle = fireParticle.userData["angle"];
            const speed = fireParticle.userData["speed"];

            const computedMovement = new Vector3(
                speed * Math.sin(angle) * deltaT * this._effectDuration * 0.75,
                -speed * Math.cos(angle) * deltaT * this._effectDuration * 0.75
            );
            fireParticle.position.add(computedMovement);

            fireParticle.scale.set(this._effectDuration, this._effectDuration, this._effectDuration);
        })

        this._smoke.children.forEach(e => {
            const smokeParticle = e as Mesh;
            (smokeParticle.material as MeshPhongMaterial).opacity = this._effectDuration;
            smokeParticle.position.add(new Vector3(0, 0, 3 * deltaT));
        })
    }

    public dispose = () => {
        this._fire.children.forEach(e => {
            (e as Mesh).geometry.dispose();
            ((e as Mesh).material as MeshPhongMaterial).dispose();
            this._fire.remove(e);
        })

        this._mesh.remove(this._fire);

        this._smoke.children.forEach(e => {
            (e as Mesh).geometry.dispose();
            ((e as Mesh).material as MeshPhongMaterial).dispose();
            this._smoke.remove(e);
        })

        this._mesh.remove(this._smoke);
    }
}

export default ShootEffect;
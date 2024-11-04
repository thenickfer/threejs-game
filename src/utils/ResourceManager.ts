import { Texture, TextureLoader } from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/Addons.js";

class ResourceManager {
    private static _instance = new ResourceManager();
    public static get instance(): ResourceManager {
        return this._instance;
    }

    private constructor() { }

    private _groundTextures: Texture[] = [];
    private _models = new Map<string, GLTF>();
    private _textures = new Map<string, Texture>();

    public getModel(modelName: string): GLTF | undefined {
        return this._models.get(modelName);
    }

    public getTexture(textureName: string): Texture | undefined {
        return this._textures.get(textureName);
    }

    public load = async () => {
        const textureLoader = new TextureLoader();

        await this.loadGroundTextures(textureLoader);
        await this.loadTextures(textureLoader);
        await this.loadModels();
    };

    private loadTextures = async (textureLoader: TextureLoader) => {
        const tankBodyTexture = await textureLoader.loadAsync("/textures/tank-body.png");
        const tankTurretTexture = await textureLoader.loadAsync("/textures/tank-turret.png");

        this._textures.set("tankBody", tankBodyTexture);
        this._textures.set("tankTurret", tankTurretTexture);

        const wallTexture = await textureLoader.loadAsync("/textures/wall.png");
        this._textures.set("wall", wallTexture);
    };

    private loadModels = async () => {
        const modelLoader = new GLTFLoader();
        const tankModel = await modelLoader.loadAsync("/models/tank.glb");

        this._models.set("tank", tankModel);
    };

    private loadGroundTextures = async (textureLoader: TextureLoader) => {
        const groundTextureFiles = ["Ground_01_Nrm.png", "Ground_01.png", "Ground_02_Nrm.png", "Ground_02.png", "Ground_03_Nrm.png", "Ground_03.png", "Ground_04_Nrm.png", "Ground_04.png"];

        for (const textureFile of groundTextureFiles) {
            const texture = await textureLoader.loadAsync(`/textures/${textureFile}`);
            this._groundTextures.push(texture);
        }
    };

    public getRandomGroundTexture = () => {
        const randomIndex = Math.floor(Math.random() * this._groundTextures.length);
        return this._groundTextures[randomIndex];
    };
}

export default ResourceManager;
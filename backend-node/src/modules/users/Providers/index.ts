import { container } from "tsyringe";
import IHashProvider from "./HashProvider/models/IHashProvider";
import BCryptHashProvider from "./HashProvider/Implementations/BCryptHashProvider";

container.registerSingleton<IHashProvider>('IHashProvider', BCryptHashProvider);
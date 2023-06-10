export { };

import { Db } from "mongodb";

declare global {
    namespace NodeJS {
        interface Global {
            _mongoClientPromise: Promise<Db>;
        }
    }
}

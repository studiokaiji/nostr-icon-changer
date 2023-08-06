import { setSecret } from "../key";

setSecret(process.argv[2]);
console.log("Success");

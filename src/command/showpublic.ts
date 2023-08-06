import { showPublic } from "../key";

try {
  console.log(JSON.stringify(showPublic(), null, 2));
  console.log("success");
} catch (error) {
  console.log(error);
}

import { setupTaskAssociations } from "./task/task.model.js";
import { setupUserAssociations } from "./user/user.model.js";

export function setupAssociations() {
    // Setup associations in the correct order
    setupUserAssociations();
    setupTaskAssociations();
}

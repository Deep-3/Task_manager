import { setupTaskAssociations } from "./task/task.model";
import { setupUserAssociations } from "./user/user.model";

export function setupAssociations() {
    // Setup associations in the correct order
    setupUserAssociations();
    setupTaskAssociations();
}

import { MessagingEnvironment } from "../src/MessagingEnvironment";

export default class FakeMessagingEnvironment extends MessagingEnvironment {
    isAdminValue = false;

    async isAdmin() {
        return this.isAdminValue;
    }

    setIsAdmin(isAdminValue) {
        this.isAdminValue = isAdminValue;
    }
}
import {Controller, Get} from "@nestjs/common";

@Controller('/app')
export default class AppController {
    @Get('/asdf')
    getRootRoute() {
        return 'Hi there!';
    }

    @Get('/bye')
    getByeThere() {
        return 'Bye there!';
    }
}
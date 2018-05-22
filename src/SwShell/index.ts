
class SwShell{

    constructor(private skipWaiting:boolean = true,private precache:Array<string> = []){

        self.addEventListener('install',this.installListener,false);
    }
    private installListener = (event:InstallEvent):void => {
        if(this.skipWaiting){
            self.skipWaiting();
        }

        // this.precache.length && event.waitUntil(Promise.resolve(1))

    }
}
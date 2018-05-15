interface SwShellParam {
    skipWaiting?: boolean; // skip waiting in install event

}

class SwShell_interface implements SwShellParam{
    constructor(skipWaiting:boolean,precache:Array<string>){

    }
}

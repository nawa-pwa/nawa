interface globalStore{
    debug?:boolean
}


class StoreState{
    private debugSetting=false

    public set debug(value:boolean){
        if(typeof value === 'boolean'){
            this.debugSetting = value;
        }
    }
    public get debug(){
        return this.debugSetting;
    }
}

export default new StoreState;
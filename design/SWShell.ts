interface SwShellParam {
    skipWaiting?: boolean; // skip waiting in install event

}

interface SwShell {
    new(param : SwShellParam);
}

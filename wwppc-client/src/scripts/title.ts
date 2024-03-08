let cpage = 'WWPPC';
let cpanel = '';
export function setTitlePanel(panel: string) {
    cpanel = panel;
    document.title = panel != '' ? `${panel} | ${cpage}` : cpage;
}
export function setTitlePage(page: string) {
    cpage = page;
    document.title = cpanel != '' ? `${cpanel} | ${page}` : page;
}
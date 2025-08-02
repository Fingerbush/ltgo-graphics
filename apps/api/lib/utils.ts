export const pad = (num: number) => num.toString().padStart(2, '0');

export function getDate() {
    return `${pad(new Date().getDate())}/${pad(new Date().getMonth() + 1)}/${pad(new Date().getFullYear())} ${pad(new Date().getHours())}:${pad(new Date().getMinutes())}:${pad(new Date().getSeconds())}`
}
export interface Introduce {
    words: string;
    keyword: string[];
    color: string[];
    weight: number;
}

export const myIntroduce: Introduce[] = [
    {
        words: "Hi, I'm xxGw.",
        keyword: ["xxGw 👋"],
        color: ["#7DB9DE"],
        weight: 10,
    },
    {
        words: "I'm a frontend software engineer in Nanchang JiangXi.",
        keyword: ["Frontend","Software Engineer 💻", "Nanchang"],
        color: ["#E03C8A", "#FFB11B"],
        weight: 6,
    },
    {
        words: "I work on frontend and Node.js development.",
        keyword: ["Frontend 🖖", "Node.js"],
        color: ["#F6C555", "#79b362"],
        weight: 7,
    },
    {
        words: "I'm passionate about Vue.js and Vite.",
        keyword: ["Vue.js", "Vite⚡"],
        color: ["#3eaf7c", "#ba38fe"],
        weight: 7,
    },
    {
        words: "I also like React and AngularJS.But I just use it on my small demo.",
        keyword: ["React", "AngularJS"],
        color: ["#61dafb", "#dd0031"],
        weight: 5,
    },
    {
        words: "I'm learning WebGL and ThreeJS.",
        keyword: ["WebGL 🚀", 'three.js'],
        color: ["#7B90D2", '#049EF4'],
        weight: 5,
    },
    {
        words: "I often hang out on Github. Open source is cool!",
        keyword: ["Github", "Open Source"],
        color: ["#555", "#33a6b8"],
        weight: 6,
    },
    {
        words: "Video game and movie are my favorite!",
        keyword: ["Video Games 🎮", "Movies 🎥", "LOL"],
        color: ["#B481BB", "#F19483"],
        weight: 6,
    },
    {
        words: "zzw's husband.",
        keyword: ["boyfriend"],
        color: ["#B481BB", "#F19483"],
        weight: 6,
    }
];

import { navLinkType } from "@lib/Types";
import { BsFillPostageHeartFill } from "react-icons/bs";
import { SiBlogger } from "react-icons/si";
import InfoIcon from "@mui/icons-material/Info";
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { RxDashboard } from "react-icons/rx";
import { SiGnuprivacyguard } from "react-icons/si";
import HomeIcon from "@mui/icons-material/Home";
import ExploreIcon from '@mui/icons-material/Explore';

const bgWave = `/images/bgWave.png`;

const logo = `/images/bg_logo.png`;


export const navList: navLinkType[] = [

    { id: 0, icon: <HomeIcon style={{ color: "red", fontSize: "100%", borderRadius: "50%", border: "1px solid white", filter: "drop-shadow(1px,1px,5x,white)" }} />, name: "home", image: logo, link: "/", desc: "home" },

    { id: 1, icon: <BsFillPostageHeartFill style={{ color: "white", fontSize: "100%", borderRadius: "50%", border: "1px solid white", filter: "drop-shadow(1px,1px,5x,white)" }} />, name: "posts", image: logo, link: "/posts", desc: "posts" },

    { id: 2, icon: <SiBlogger style={{ color: "white", fontSize: "100%", borderRadius: "50%", border: "1px solid white", filter: "drop-shadow(1px,1px,5x,white)" }} />, name: "blogs", image: logo, link: "/blogs", desc: "blogs" },

    { id: 3, icon: <RxDashboard style={{ color: "white", fontSize: "100%", borderRadius: "50%", border: "1px solid white", filter: "drop-shadow(1px,1px,5x,white)" }} />, name: "dashboard", image: logo, link: "/dashboard", desc: "dashboard" },
    { id: 3, icon: <SiGnuprivacyguard style={{ color: "white", fontSize: "100%", borderRadius: "50%", border: "1px solid white", filter: "drop-shadow(1px,1px,5x,white)" }} />, name: "register", image: logo, link: "/register", desc: "dashboard" },




]
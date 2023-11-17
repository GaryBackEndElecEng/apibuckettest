import { navLinkType } from "@lib/Types";
import InfoIcon from "@mui/icons-material/Info";
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import HomeIcon from "@mui/icons-material/Home";
import ExploreIcon from '@mui/icons-material/Explore';

const bgWave = `/images/bgWave.png`;

const logo = `/images/bg_logo.png`;


export const navList: navLinkType[] = [

    { id: 1, icon: <ExploreIcon sx={{ color: "red", ml: 1, mr: 1, fontSize: "130%" }} />, name: "posts", image: logo, link: "/posts", desc: "posts" },

    { id: 2, icon: <ExploreIcon sx={{ color: "red", ml: 1, mr: 1, fontSize: "130%" }} />, name: "blogs", image: logo, link: "/blogs", desc: "blogs" },

    { id: 3, icon: <ExploreIcon sx={{ color: "red", ml: 1, mr: 1, fontSize: "130%" }} />, name: "dashboard", image: logo, link: "/dashboard", desc: "dashboard" },

    { id: 4, icon: <ExploreIcon sx={{ color: "red", ml: 1, mr: 1, fontSize: "130%" }} />, name: "create a blog", image: logo, link: "/dashboard/createBlog", desc: "" },



]
import { navImageLinkType } from "@lib/Types";
import InfoIcon from "@mui/icons-material/Info";
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import HomeIcon from "@mui/icons-material/Home";
import ExploreIcon from '@mui/icons-material/Explore';

const staticImage = process.env.NEXT_PUBLIC_aws_static;
const masterImage = process.env.NEXT_PUBLIC_aws;
const directGraph = `${masterImage}/directGraph3.png`;
const graph = `${masterImage}/graph.png`;

const post = `${staticImage}/images/study.png`;


export const allNavLinks: navImageLinkType[] = [

    { id: 1, icon: <ExploreIcon sx={{ color: "red", ml: 1, mr: 1, fontSize: "130%" }} />, name: "home", image: post, link: "/posts", desc: "" },

    { id: 2, icon: <ExploreIcon sx={{ color: "red", ml: 1, mr: 1, fontSize: "130%" }} />, name: "upload test", image: graph, link: "/admin/uploadTest", desc: "" },

    { id: 3, icon: <ExploreIcon sx={{ color: "red", ml: 1, mr: 1, fontSize: "130%" }} />, name: "admin", image: directGraph, link: "/admin", desc: "" },

    { id: 4, icon: <ExploreIcon sx={{ color: "red", ml: 1, mr: 1, fontSize: "130%" }} />, name: "new blog", image: graph, link: "/blog/newblogs", desc: "" },

    { id: 5, icon: <ExploreIcon sx={{ color: "red", ml: 1, mr: 1, fontSize: "130%" }} />, name: "new blog", image: graph, link: "/template", desc: "" },

    { id: 5, icon: <ExploreIcon sx={{ color: "red", ml: 1, mr: 1, fontSize: "130%" }} />, name: "preSigned", image: graph, link: "/template/presignPost", desc: "" },

]
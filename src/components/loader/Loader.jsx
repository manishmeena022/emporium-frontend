import ReactDom from "react-dom";
import loaderImg from "../../assets/images/loader.gif";
import styles from "./Loader.module.scss";

export const Loader = () => {
  return ReactDom.createPortal (
    <div className={styles.wrapper}>
        <div className={styles.loader}>
            <img src={loaderImg} alt='loading....' />
        </div>
    </div>,
    document.getElementById("loader")
  );
};

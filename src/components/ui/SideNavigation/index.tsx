import styles from "./SideNavigation.module.scss";
const SideNavigation = () => {
	return (
		<div className={`col-lg-2 d-none d-lg-flex ${styles.container__sidenav}`}>
			<div className={styles.navbar__side}>
				<ul className="list-group list-group-flush">
					<li className={styles.mainlink}>
						<a href="../index.html">Background</a>
					</li>
					<li className={styles.mainlink}>
						<a href="../how.html">How Does AI Work to Classify Things?</a>
					</li>
					<li className={`${styles.mainlink} ${styles.active}`}>
						<a href="#!">Create an AI App: Joe's Lunch</a>
					</li>

					<li className={styles.mainlink}>
						<a href="../creative.html">How Does AI Work as a Creative Tool?</a>
					</li>
					<li className={styles.mainlink}>
						<a href="../art.html">Create an AI App: AI for African Arts</a>
					</li>
					<li className={styles.mainlink}>
						<a href="../create.html">Create Your Own AI Project</a>
					</li>
				</ul>
			</div>
		</div>
	);
};

export default SideNavigation;

import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { currentInstance } from '../../../../utils'
import PsContext from '../../../../context';
const Sidebar = (props) => {
	const context = useContext(PsContext);
	const [currentNav, setCurrentNav] = useState([]);
	useEffect(() => {

		import('../../business/' + currentInstance.name + '/nav').then((module) => {
			setCurrentNav(module.default);
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	const getMenues = () => {
		var permittedMenues = [];
		currentNav.forEach(item => {
			if (item.childrens) {
				var permittedChildrens = [];
				if (item.childrens.length > 0) {
					item.childrens.forEach(childMenu => {
						if (childMenu.resourceName) {
							if (context.isAdminResourcePermit(props.user, childMenu.resourceName))
								permittedChildrens.push(childMenu);
						} else permittedChildrens.push(childMenu);

					})
				}
				if (permittedChildrens.length > 0) {
					var modifiedMenu = item;
					modifiedMenu.childrens = permittedChildrens;
					permittedMenues.push(modifiedMenu);
				}
			}
			else {
				if (item.resourceName) {
					if (context.isAdminResourcePermit(props.user, item.resourceName))
						permittedMenues.push(item);
				} else permittedMenues.push(item);
			}

		});
		//console.log('menues',menus,permittedMenues)
		return permittedMenues;
	}
	const getMenuPanel = (item) => {
		var subMenus = [];
		if (item.childrens) {
			item.childrens.forEach(obj => {
				var path = obj.path.replace(":userId", props.user)
				subMenus.push(<li>
					<a href={'#' + path} className="item">
						<div className="icon-box bg-primary">
							<i className={obj.icon}></i>

						</div>
						<div className="in">
							{obj.name}
							{/* <span className="badge badge-primary">10</span> */}
						</div>
					</a>
				</li>)
			})
			return (<><div className="listview-title mt-1">{item.name}</div>
				<ul className="listview flush transparent no-line image-listview">
					{subMenus}

				</ul></>)

		} else {
			var path = item.path.replace(":userId", props.user)
			return (<>
				<ul className="listview flush transparent no-line image-listview">
					<li>
						<a href={'#' + path} className="item">
							<div className="icon-box bg-primary">
								<i className={item.icon}></i>

							</div>
							<div className="in">
								{item.name}
								{/* <span className="badge badge-primary">10</span> */}
							</div>
						</a>
					</li>

				</ul></>)

		}

	}
	return (
		<div
			className="modal fade panelbox panelbox-left show"


			role="dialog"
			style={{ display: props.show ? 'block' : 'none' }}
		>
			<div className="modal-dialog" role="document">
				<div className="modal-content">
					<div className="modal-body p-0">
						{/* profile box */}
						<div className="profileBox pt-2 pb-2">
							<div className="image-wrapper">
								<img
									src={context.noMale}
									alt="image"
									className="imaged  w36"
								/>
							</div>
							<div className="in">
								<strong>{context.adminUser(props.user).username}</strong>
								<div className="text-muted">{context.adminUser(props.user).ref_id2}</div>
							</div>
							<a
								onClick={props.onClose}
								className="btn btn-link btn-icon sidebar-close"

							>
								<FontAwesomeIcon icon={faClose} />
							</a>
						</div>
						{/* * profile box */}
						{/* balance */}
						{/* <div className="sidebar-balance">
									<div className="listview-title">Balance</div>
									<div className="in">
										<h1 className="amount">$ 2,562.50</h1>
									</div>
								</div> */}
						{/* * balance */}
						{/* action group */}
						{/* <div className="action-group">
									<a href="app-index.html" className="action-button">
										<div className="in">
											<div className="iconbox">
												<ion-icon name="add-outline" />
											</div>
											Deposit
										</div>
									</a>
									<a href="app-index.html" className="action-button">
										<div className="in">
											<div className="iconbox">
												<ion-icon name="arrow-down-outline" />
											</div>
											Withdraw
										</div>
									</a>
									<a href="app-index.html" className="action-button">
										<div className="in">
											<div className="iconbox">
												<ion-icon name="arrow-forward-outline" />
											</div>
											Send
										</div>
									</a>
									<a href="app-cards.html" className="action-button">
										<div className="in">
											<div className="iconbox">
												<ion-icon name="card-outline" />
											</div>
											My Cards
										</div>
									</a>
								</div> */}
						{/* * action group */}
						{/* menu */}
						{
							getMenues().map(item => {
								return item.allowed.indexOf(props.role) > -1 ? getMenuPanel(item) : null
							})
						}

						{/* * menu */}

						{/* image icon sample start*/}
						{/* <div className="listview-title mt-1">Send Money</div>
								<ul className="listview image-listview flush transparent no-line">
									<li>
										<a href="#" className="item">
											<img
												src="assets/img/sample/avatar/avatar2.jpg"
												alt="image"
												className="image"
											/>
											<div className="in">
												<div>Artem Sazonov</div>
											</div>
										</a>
									</li>
									<li>
										<a href="#" className="item">
											<img
												src="assets/img/sample/avatar/avatar4.jpg"
												alt="image"
												className="image"
											/>
											<div className="in">
												<div>Sophie Asveld</div>
											</div>
										</a>
									</li>
									<li>
										<a href="#" className="item">
											<img
												src="assets/img/sample/avatar/avatar3.jpg"
												alt="image"
												className="image"
											/>
											<div className="in">
												<div>Kobus van de Vegte</div>
											</div>
										</a>
									</li>
								</ul> */}
						{/* * image icon sample end */}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Sidebar;
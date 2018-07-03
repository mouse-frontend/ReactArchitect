import React from 'react';

import * as FontAwesome from 'react-icons/lib/fa';

export default class WidgetComponentItem extends React.PureComponent {
	constructor(props) {
		super(props);
		this.saveComponentName = this.saveComponentName.bind(this);
		this.connectComponent = this.connectComponent.bind(this);
		this.deleteComponent = this.deleteComponent.bind(this);
		this.targetComponents = this.targetComponents.bind(this);
		this.untargetComponents = this.untargetComponents.bind(this);
		this.handleDrag = this.handleDrag.bind(this);
	}

	state = {
		editing: false
	}

	componentDidMount() {
		// get map
		this.map = document.getElementById('map-holder');

		this.input.focus();
		this.input.select();
	}

	componentDidUpdate() {
		const { component } = this.props;

		this.input.value = component.name;
	}

	handleDrag(e) {

		let handleMouseMove = e => {
			// move draggable block to cursor position
			this.draggable.style.left = e.clientX - 13 + 'px';
			this.draggable.style.top = e.clientY - this.draggable.offsetHeight/2 + 'px';

			// get hovered slot
			const hoveredSlot = e.target.classList.contains('map-slot') && !e.target.dataset.root ? e.target : null;

			// if no slot
			if (!hoveredSlot) {
				// if saved slot
				if (this.hoveredSlot) {
					// clean saved slot
					this.hoveredSlot.classList.remove('insert-left', 'insert-right', 'insert-error');
					this.hoveredSlot = null;
					this.insertError = false;
				}
				// do nothing
				return;
			}

			// if another slot
			if (this.hoveredSlot !== hoveredSlot) {
				// clean saved slot
				this.hoveredSlot && this.hoveredSlot.classList.remove('insert-left', 'insert-right', 'insert-error');

				// save new slot
				this.hoveredSlot = hoveredSlot;

				// validate inserting component in hovered slot
				if (!this.canBeChildOf(this.hoveredSlot.parentElement.closest('.map-slot').dataset.component*1)) {
					this.hoveredSlot.classList.add('insert-error');
					this.insertError = true;
				} else {
					this.hoveredSlot.classList.remove('insert-error');
					this.insertError = false;
				}
			}

			// get slot data
			const slotData = this.hoveredSlot.getBoundingClientRect();

			if (e.clientX > slotData.left + slotData.width/2) {
				this.hoveredSlot.classList.remove('insert-left');
				this.hoveredSlot.classList.add('insert-right');
				this.isNext = true;
			} else {
				this.hoveredSlot.classList.remove('insert-right');
				this.hoveredSlot.classList.add('insert-left');
				this.isNext = false;
			}
		}

		let handleMouseUp = e => {
			// disable drag mode
			this.map.classList.remove('inserting');
			// hide draggable block
			this.draggable.classList.remove('active');

			// if slot and can insert
			if (this.hoveredSlot && !this.insertError) {
				const parentID = this.hoveredSlot.dataset.parent * 1;
				const index = this.hoveredSlot.dataset.index;

				// update parent children
				const { component, components, updateComponent } = this.props;

				let children = components.find(c => c.id === parentID).children;
				children.splice(
					(index ? (this.isNext ? index*1 + 1 : index) : 0),
					0,
					{
						id: component.id,
						multiple: false
					}
				);


				updateComponent({
					id: parentID,
					data: {
						children
					}
				});
			}

			// clear saved slot
			if (this.hoveredSlot) {
				this.hoveredSlot.classList.remove('insert-left', 'insert-right', 'insert-error');
				this.hoveredSlot = null;
				this.insertError = false;
			}

			// remove event listeners
			document.removeEventListener('mouseup', handleMouseUp);
			document.removeEventListener('mousemove', handleMouseMove);
		}

		// enable drag mode
		this.map.classList.add('inserting');
		this.draggable.classList.add('active');

		// set dragged component position
		this.draggable.style.left = e.clientX - 13 + 'px';
		this.draggable.style.top = e.clientY - this.draggable.offsetHeight/2 + 'px';

		// add event listeners
		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);
	}

	canBeChildOf(id){
		const { component, components } = this.props;

		// add children to field of view
		let fieldOfView = [...components.find(c => c.id === id).children.map(child => child.id)];

		// get parents
		const getParents = (array) => {
			// add items in array to field of view
			fieldOfView.push(...array);

			let arrayParents = [];
			// get parents for each in array
			array.forEach(a => {
				// search this id in children of each component
				components.forEach(c => {
					// if id exists in children of current component
					if (c.children.find(child => child.id === a)) {
						// push component.id to parents
						arrayParents.push(c.id);
					}
				})
			});

			// get next parents if exists
			if (arrayParents.length) {
				getParents(arrayParents);
			}
		}
		getParents([id]);

		// check component in field of view
		if (fieldOfView.includes(component.id)) {
			return false;
		}

		return true;
	}

	targetComponents() {
		const { component } = this.props;

		// get current component slots
		let slots = this.map.querySelectorAll(`.map-component[data-component="${component.id}"]`);

		// unfade selected components
		if (slots) {
			[...slots].forEach(slot => slot.classList.add('unfade'));;
		}

		// fade map
		this.map.classList.add('fade');
	}

	untargetComponents(e) {
		const { component } = this.props;

		// get current component slots
		let slots = this.map.querySelectorAll(`.map-component[data-component="${component.id}"]`);

		// clean current component slots
		if (slots) {
			[...slots].forEach(slot => slot.classList.remove('unfade'));;
		}

		// unfade map
		this.map.classList.remove('fade');
	}

	setEditing(value) {
		this.setState({editing: value});
	}

	saveComponentName(e) {
		const { component, updateComponent } = this.props;

		// off edit state
		this.setEditing(false);

		let formatedValue;

		// remove special characters
		formatedValue = e.target.value.replace(/[^a-zA-Z0-9]+/g, '');

		// remove first number
		while (formatedValue && formatedValue[0].match(/[0-9]/)) {
			formatedValue = formatedValue.substr(1);
		}

		// uppercase first letter
		if (formatedValue && !formatedValue[0].match(/[A-Z]/)) {
			formatedValue = formatedValue[0].toUpperCase() + formatedValue.substr(1);
		}

		if (!formatedValue) {
			formatedValue = `Component${component.id + 1}`
		}

		// update name in store
		updateComponent({
			id: component.id,
			data: {
				name: formatedValue
			}
		});
	}

	connectComponent() {
		const { component, updateComponent } = this.props;

		updateComponent({
			id: component.id,
			data: {
				connected: !component.connected
			}
		});
	}

	deleteComponent() {
		const { component, deleteComponent } = this.props;

		deleteComponent(component.id);
	}

	render() {
		const { editing } = this.state;
		const { component, used } = this.props;

		return (
			<div
				className={`widget-component-item${component.connected ? ' connected' : ''}`}
			>
				<div className="widget-holder">
					<div className="actions">
						<button
							className={`btn-icon${component.connected ? ' active' : ''}`}
							onClick={this.connectComponent}
						>
							<FontAwesome.FaPlug />
						</button>
					</div>
					<div className="name">
						<input
							type="text"
							ref={el => this.input = el}
							defaultValue={component.name}
							placeholder="Enter name..."
							onFocus={() => this.setEditing(true)}
							onBlur={this.saveComponentName}
						/>
					</div>
					<div className="actions">
						<button className={`btn-icon${!editing ? ' hidden' : ''}`}>
							<FontAwesome.FaCheck />
						</button>
						<button
							className={`btn-icon type ${component.type}`}
							onClick={this.connectComponent}
						>
							<span className="type-c">C</span>
							<span className="type-f">F</span>
						</button>
						<button className="btn-icon">
							<FontAwesome.FaCog />
						</button>
						<button
							className={`btn-icon${component.root || used ? ' disabled' : ''}`}
							onClick={this.deleteComponent}
						>
							<FontAwesome.FaTrash />
						</button>
						<button
							className={`btn-icon${!used ? ' disabled' : ''}`}
							ref={el => this.targetSlotHandler = el}
							onMouseEnter={this.targetComponents}
							onMouseOut={this.untargetComponents}
						>
							<FontAwesome.FaCrosshairs />
						</button>
						<div
							className={`btn-icon drag${component.root ? ' disabled' : ''}`}
							ref={el => this.dragHandler = el}
							onMouseDown={this.handleDrag}
						>
							<FontAwesome.FaEllipsisV />
						</div>
					</div>
				</div>
				{!component.root &&
				<div
					className="draggable"
					ref={el => this.draggable = el}
				>
					<div
						className="btn-icon drag"
					>
						<FontAwesome.FaEllipsisV />
					</div>
					<div className="name">
						{component.name}
					</div>
				</div>}
			</div>
		);
	}
}

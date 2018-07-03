import React from 'react';

import { connect } from 'react-redux';

import Component from './Component';
import * as FontAwesome from 'react-icons/lib/fa';

class ProjectMap extends React.Component {
	constructor(props) {
		super(props);
		this.moveMap = this.moveMap.bind(this);
		this.zoomMap = this.zoomMap.bind(this);
		this.zoom = 1;
		this.zoomMax = 2;
		this.zoomMin = 0.3;
		this.zoomStep = 0.1;
	}

	componentDidMount() {
		this.centerMap();
		this.calculateLinks();
	}

	componentDidUpdate() {
		this.calculateLinks();
	}

	// center map
	centerMap() {
		this.map.style.left = (this.holder.offsetWidth - this.map.offsetWidth) / 2 + 'px';
		this.map.style.top = (this.holder.offsetHeight - this.map.offsetHeight) / 2 + 'px';
	}

	// move map
	moveMap(e) {
		if (e.target.closest('.map-component') || e.target.closest('.map-placeholder')) return;

		this.startCursorPosition = {
			x: e.clientX,
			y: e.clientY
		};

		const mapStyles = window.getComputedStyle(this.map);
		this.startMapPosition = {
			x: mapStyles.getPropertyValue('left').replace(/px/, ''),
			y: mapStyles.getPropertyValue('top').replace(/px/, '')
		};

		this.holder.classList.add('draggable');

		const mouseMoveDrag = e => {

			let newLeft = this.startMapPosition.x - (this.startCursorPosition.x - e.clientX);
			let newTop = this.startMapPosition.y - (this.startCursorPosition.y - e.clientY);

			let leftBorder = (this.map.offsetWidth - this.holder.offsetWidth / 2);
			let rightBorder = (this.holder.offsetWidth / 2);
			let topBorder = (this.holder.offsetHeight / 2);
			let bottomBorder = (this.map.offsetHeight - this.holder.offsetHeight / 2);

			// check x
			if (-newLeft > leftBorder) {
				newLeft = -leftBorder;
			} else
			if (newLeft > rightBorder) {
				newLeft = rightBorder;
			}

			// check y
			if (newTop > topBorder) {
				newTop = topBorder;
			} else
			if (-newTop > bottomBorder) {
				newTop = -bottomBorder;
			}

			this.map.style.left = newLeft + 'px';
			this.map.style.top = newTop + 'px';
		}

		const mouseUpDrag = e => {
			document.removeEventListener('mousemove', mouseMoveDrag);
			document.removeEventListener('mouseup', mouseUpDrag);

			this.holder.classList.remove('draggable');
		}

		document.addEventListener('mousemove', mouseMoveDrag);
		document.addEventListener('mouseup', mouseUpDrag)
	}

	// zoom map
	zoomMap(e) {
		// zoom from buttons
		if (typeof e === 'number') {
			if (e < 0 && !(Math.round((this.zoom - this.zoomStep) * 100) / 100 < this.zoomMin)) {
				this.zoom = Math.round((this.zoom - this.zoomStep) * 100) / 100;
			} else
			if (e === 0) {
				this.zoom = 1;
			} else
			if (e > 0 && !(Math.round((this.zoom + this.zoomStep) * 100) / 100 > this.zoomMax)) {
				this.zoom = Math.round((this.zoom + this.zoomStep) * 100) / 100;
			}
		}
		// zoom from scroll wheel
		else {
			if (e.deltaY < 0 && !(Math.round((this.zoom + this.zoomStep) * 100) / 100 > this.zoomMax)) {
				this.zoom = Math.round((this.zoom + this.zoomStep) * 100) / 100;
			} else
			if (e.deltaY > 0 && !(Math.round((this.zoom - this.zoomStep) * 100) / 100 < this.zoomMin)){
				this.zoom = Math.round((this.zoom - this.zoomStep) * 100) / 100;
			}
		}

		// apply zoom to map
		this.map.style.transform = `scale(${this.zoom})`;

		// update zoom status
		this.zoomStatus.innerHTML = `${(this.zoom * 100).toFixed()}%`;
	}

	// generate map
	createComponent(component, index, parentID, multiple) {
		const { components } = this.props;

		return (
			<div
				className="map-slot"
				key={component.id || 'root'}
				data-parent={parentID}
				data-component={component.id}
				data-index={index}
				data-root={component.root}
			>
				<Component
					parentID={parentID}
					component={component}
					multiple={multiple}
				/>
				{component.children.length > 0 &&
				<div className="map-block">
					<div className="block-link"></div>
					<div className="h-link"></div>

					{component.children.map((child, i) => this.createComponent(
						components.find(c => c.id === child.id),
						i,
						component.id,
						child.multiple
					))}
				</div>}
				{component.children.length === 0 &&
				<div
					className="map-slot map-placeholder"
					data-parent={component.id}
				>
					Drag component here
					<div className="insert">
						<FontAwesome.FaArrowCircleDown className="valid" />
						<FontAwesome.FaBan className="novalid" />
					</div>
				</div>}
				<div className="insert">
					<FontAwesome.FaArrowCircleDown className="valid" />
					<FontAwesome.FaBan className="novalid" />
				</div>
			</div>
		);
	}

	// calculate links width and left position
	calculateLinks() {
		const blocks = this.holder.querySelectorAll('.map-block');

		blocks.forEach(block => {
			const slots = [...block.children].filter(child => child.classList.contains('map-slot'));
			const link = block.querySelector('.h-link');

			if (slots.length < 2) {
				link.style.width = 0 + 'px';
				return;
			}

			link.style.left = slots[0].offsetLeft + slots[0].offsetWidth/2 + 'px';
			link.style.width = (slots[slots.length - 1].offsetLeft + slots[slots.length - 1].offsetWidth/2) - (slots[0].offsetLeft + slots[0].offsetWidth/2) + 'px';
		});
	}

	render() {
		const { components } = this.props;

		return (
			<React.Fragment>
				<div
					id="map-holder"
					ref={el => this.holder = el}
					onMouseDown={this.moveMap}
					onWheel={this.zoomMap}
				>
					<div
						className="map"
						ref={el => this.map = el}
					>
						{this.createComponent(components.find(c => c.root))}
					</div>
				</div>
				<div className="map-controls">
					<div
						className="zoom"
						ref={el => this.zoomStatus = el}
					>
						{(this.zoom * 100).toFixed()}%
					</div>
					<button
						className="btn-icon"
						onClick={e => this.zoomMap(-1)}
					>
						<FontAwesome.FaSearchMinus />
					</button>
					<button
						className="btn-icon"
						onClick={e => this.zoomMap(1)}
					>
						<FontAwesome.FaSearchPlus />
					</button>
					<button
						className="btn-icon"
						onClick={e => this.zoomMap(0)}
					>
						<FontAwesome.FaBullseye />
					</button>
				</div>
			</React.Fragment>
		);
	}
}

export default connect(
	state => ({
		components: state.components
	})
)(ProjectMap);

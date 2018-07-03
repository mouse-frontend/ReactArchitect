import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as componentActions from '../actions/componentActions';

import * as FontAwesome from 'react-icons/lib/fa';

class Component extends React.PureComponent {
	constructor(props) {
		super(props);
		this.setMultiple = this.setMultiple.bind(this);
		this.connectComponent = this.connectComponent.bind(this);
		this.deleteSlot = this.deleteSlot.bind(this);
	}

	state = {
		mounted: false
	}

	componentDidMount() {
		this.setState({mounted: true});
	}

	// toggle multiple by changing parent child
	setMultiple() {
		const { parentID, components, component } = this.props;
		const { updateComponent } = this.props.componentActions;

		let children = components.find(c => c.id === parentID).children.map(child => {
			if (child.id === component.id) child.multiple = !child.multiple;
			return child;
		});

		updateComponent({
			id: parentID,
			data: {
				children
			}
		})
	}

	// toggle connect
	connectComponent() {
		const { component } = this.props;
		const { updateComponent } = this.props.componentActions;

		updateComponent({
			id: component.id,
			data: {
				connected: !component.connected
			}
		});
	}

	// remove component from parent children
	deleteSlot() {
		const { parentID, components, component } = this.props;
		const { updateComponent } = this.props.componentActions;

		let children = components.find(c => c.id === parentID).children.filter(child => child.id !== component.id);

		updateComponent({
			id: parentID,
			data: {
				children
			}
		})
	}

	render() {
		const { mounted } = this.state;
		const { component, multiple } = this.props;

		return (
			<div
				className={`map-component${!mounted ? ' mounting' : ''}${component.connected ? ' connected' : ''}${multiple ? ' multiple' : ''}`}
				data-component={component.id}
			>
				{!component.root &&
				<div className="component-link"></div>}
				<div className="multi"></div>
				<div className="box">
					<div className="header">
						<div className="name">{component.name}</div>
						<div className="actions">
							<button
								className={`btn-icon${component.connected ? ' active' : ''}`}
								onClick={this.connectComponent}
							>
								<FontAwesome.FaPlug />
							</button>
							<button
								className={`btn-icon type ${component.type}`}
								onClick={this.connectComponent}
							>
								<span className="type-c">C</span>
								<span className="type-f">F</span>
							</button>
							{!component.root &&
							<button
								className={`btn-icon${multiple ? ' active' : ''}`}
								onClick={this.setMultiple}
							>
								<FontAwesome.FaListOl />
							</button>}
							{!component.root &&
							<button
								className="btn-icon"
								onClick={this.deleteSlot}
							>
								<FontAwesome.FaClose />
							</button>}
						</div>
					</div>
					<div className="columns">
						<div className="col">
							<div className="title">
								<div className="title-text">Props</div>
								<button className="btn-icon">
									<FontAwesome.FaPlus />
								</button>
							</div>
							<div className="list">
								{component.propsParent.map(prop => <div key={prop} className="item prop-parent">{prop}</div>)}
								{component.connected && component.propsStore.map(prop => <div key={prop} className="item prop-store">{prop}</div>)}
							</div>
						</div>
						<div className="col">
							<div className="title">
								<div className="title-text">State</div>
								<button className="btn-icon">
									<FontAwesome.FaPlus />
								</button>
							</div>
							<div className="list">
								{component.state.map(prop => <div key={prop} className="item prop-state">{prop}</div>)}
							</div>
						</div>
						<div className="col">
							<div className="title">
								<div className="title-text">Actions</div>
								<button className="btn-icon">
									<FontAwesome.FaPlus />
								</button>
							</div>
							<div className="list">
								{component.actionsParent.map(action => <div key={action} className="item action-parent">{action}</div>)}
								{component.actionsSelf.map(action => <div key={action} className="item action-self">{action}</div>)}
								{component.connected && component.actionsStore.map(action => <div key={action} className="item action-store">{action}</div>)}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default connect(
	state => ({
		components: state.components
	}),
	dispatch => ({
		componentActions: bindActionCreators(componentActions, dispatch)
	})
)(Component);

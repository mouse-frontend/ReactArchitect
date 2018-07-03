import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as componentActions from '../actions/componentActions';

import * as FontAwesome from 'react-icons/lib/fa';
import WidgetComponentItem from './WidgetComponentItem';

class WidgetComponents extends React.Component {
	render() {
		const { components } = this.props;
		const { createComponent, updateComponent, deleteComponent } = this.props.componentActions;

		return (
			<div className="widget active">
				<div className="widget-header">
					<div className="widget-title">Components</div>
					<button className="btn-icon inverse">
						<FontAwesome.FaMinusCircle />
					</button>
				</div>
				<div className="widget-body">
					{components.map(component => (
						<WidgetComponentItem
							key={component.id}
							component={component}
							components={components}
							updateComponent={updateComponent}
							deleteComponent={deleteComponent}
							used={Boolean(component.root || components.find(c => c.children.find(child => child.id === component.id)))}
						/>
					))}
				</div>
				<div className="widget-footer">
					<button
						className="btn-add"
						onClick={createComponent}
					>
						<FontAwesome.FaPlus />
					</button>
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
	}),
)(WidgetComponents);

import React from 'react';

import WidgetComponents from './WidgetComponents';
import WidgetStore from './WidgetStore';
import ProjectMap from './ProjectMap';
import * as FontAwesome from 'react-icons/lib/fa';

export default class App extends React.Component {
	render() {
		return (
			<React.Fragment>
				<div id="left-panel">
					<WidgetComponents />
					<div className="widget">
						<div className="widget-header">
							<div className="widget-title">Reducers</div>
							<div className="btn-icon inverse">
								<FontAwesome.FaPlusCircle />
							</div>
						</div>
					</div>
					<div className="widget">
						<div className="widget-header">
							<div className="widget-title">Actions</div>
							<div className="btn-icon inverse">
								<FontAwesome.FaPlusCircle />
							</div>
						</div>
					</div>
					<div className="widget">
						<div className="widget-header">
							<div className="widget-title">Router</div>
							<div className="btn-icon inverse">
								<FontAwesome.FaPlusCircle />
							</div>
						</div>
					</div>
				</div>
				<ProjectMap />
			</React.Fragment>
		);
	}
}

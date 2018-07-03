import * as constants from '../actions/constants';

const initialState = [
	{
		id: 0,
		root: true,
		name: 'App',
		connected: false,
		type: 'c',
		propsParent: ['parentProp1', 'parentProp2'],
		propsStore: ['storeProp1', 'storeProp2'],
		state: ['stateProp1', 'stateProp2'],
		actionsParent: ['parentAction1', 'parentAction2'],
		actionsSelf: ['selfAction1', 'selfAction2'],
		actionsStore: ['storeAction1', 'storeAction2 qasd asd as d'],
		children: [
			{
				id: 1,
				multiple: false
			},
			{
				id: 2,
				multiple: false
			},
			{
				id: 3,
				multiple: false
			}
		]
	},
	{
		id: 1,
		name: 'Header',
		connected: true,
		type: 'c',
		propsParent: ['parentProp1', 'parentProp2'],
		propsStore: ['storeProp1', 'storeProp2'],
		state: ['stateProp1', 'stateProp2'],
		actionsParent: ['parentAction1', 'parentAction2'],
		actionsSelf: ['selfAction1', 'selfAction2'],
		actionsStore: ['storeAction1', 'storeAction2'],
		children: []
	},
	{
		id: 2,
		name: 'Page',
		connected: true,
		type: 'c',
		propsParent: ['parentProp1', 'parentProp2'],
		propsStore: ['storeProp1', 'storeProp2'],
		state: ['stateProp1', 'stateProp2'],
		actionsParent: ['parentAction1', 'parentAction2'],
		actionsSelf: ['selfAction1', 'selfAction2'],
		actionsStore: ['storeAction1', 'storeAction2'],
		children: []
	},
	{
		id: 3,
		name: 'Footer',
		connected: true,
		type: 'c',
		propsParent: ['parentProp1', 'parentProp2'],
		propsStore: ['storeProp1', 'storeProp2'],
		state: ['stateProp1', 'stateProp2'],
		actionsParent: ['parentAction1', 'parentAction2'],
		actionsSelf: ['selfAction1', 'selfAction2'],
		actionsStore: ['storeAction1', 'storeAction2'],
		children: []
	}
];

export default (state = initialState, action) => {
	switch (action.type) {
		case constants.UPDATE_COMPONENT:
			// check for double name
			if (action.payload.data.name && state.find(c => c.name === action.payload.data.name && action.payload.id !== c.id)) {
				action.payload.data.name += state.length + 1;
			}
			return state.map(c => {
				if (c.id === action.payload.id) {
					c = {
						...c,
						...action.payload.data
					}
				}
				return c;
			});

		case constants.CREATE_COMPONENT:
			return [
				...state,
				{
					id: state.length ? state[state.length - 1].id + 1 : 0,
					name: `Component${state.length + 1}`,
					connected: false,
					type: 'c',
					propsParent: [],
					propsStore: [],
					state: [],
					actionsParent: [],
					actionsSelf: [],
					actionsStore: [],
					children: []
				}
			];

		case constants.DELETE_COMPONENT:
			return state.filter(c => c.id !== action.payload);

		default:
			return state;
	}
}

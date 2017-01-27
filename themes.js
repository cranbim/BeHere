module.exports={
	//exportname: internalName
	ThemeMaster: ThemeMaster
};

function ThemeMaster(){

	this.narrative1={
		sequence: [
			{name: 'ThemePlasma1', duration: 4, params:[]},
			{name: 'ThemeTVStatic', duration: 4, params:[]},
			// {name: 'ThemeSpark', duration : 4, params: []},
			// {name: 'ThemeStrings', duration: 4, params: []},
			// {name: 'ThemeHairBall', duration: 4, params:[]},
			// {name: 'ThemeFlyThrough', duration: 4, params:[]},
			// {name: 'ThemeFlipper1', duration: 4, params:[]},
			// {name: 'ThemePsychaRing', duration: 4, params:[]},
			// {name: 'ThemeBounceChain', duration: 4, params:[]},
			// {name: 'ThemeSparker', duration: 4, params:[]},
			// {name: 'ThemeSwisher', duration: 4, params:[]},
			{name: 'ThemeTextScroller', duration: 4, params: []},
			// {name: 'ThemeRepelWobble', duration: 4, params:[]},
			// {name: 'ThemeCracker', duration: 4, params:[]},
			// {name: 'ThemeDust', duration : 4, params: []},
			// {name: 'ThemeNoise1', duration : 4, params: []},
			// {name: 'ThemeBounceRings', duration : 4, params: []},
		]
	};
	
	this.themeLoader=[
		"ThemeDefault",
		"ThemePlasma1",
		"ThemeFlyThrough",
		"ThemeRepelWobble",
		"ThemeBounceRings",
		"ThemeFlipper1",
		"ThemePsychaRing",
		"ThemeBounceChain",
		"ThemeSparker",
		"ThemeSpark",
		"ThemeDust",
		"ThemeNoise1",
		"ThemeTVStatic",
		"ThemeHairBall",
		"ThemeSwisher",
		"ThemeCracker",
		"ThemeStrings",
		"ThemeTextScroller"
	];


}

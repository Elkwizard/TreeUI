const TreeUI = {
	create(name, obj) {
		return new TreeUI.Node(name, obj, [], null);
	},
	stringify(value, object, key) {
		const FUNCTION_ARG_LETTERS = "abcdefghijklmnopqrstuvwxyz".split("");
		// const FUNCTION_ARG_LETTERS = "xyzwijklabcd".split("");
		if ((typeof value).match(/string|number|boolean/g)) {
			let input = document.createElement("input");
			if (typeof value === "string") input.placeholder = "empty string";
			input.type = { number: "number", string: "text", boolean: "checkbox" }[typeof value];
			input.className = `tui ${typeof value}`;
			if (typeof value === "boolean") input.checked = value;
			else input.value = value;
			input.onchange = function () {
				if (typeof value === "boolean") {
					object[key] = input.checked;
					input.checked = object[key];
				} else {
					object[key] = input.value;
					input.value = object[key];
				}
			}
			return input;
		} else {
			let div = document.createElement("div");
			div.className = "tui";

			if (typeof value === "function") {
				div.innerText = "f (" + FUNCTION_ARG_LETTERS.slice(0, value.length).join(", ") + ")";
				div.classList.add("function");
			}
			if (typeof value === "symbol") {
				let str = value.toString();
				div.innerText = str.slice(7, str.length - 1);
				div.classList.add("symbol");
			}
			if (value === undefined || value === null) {
				div.innerText = value + "";
				div.classList.add("null");
			}
			return div;
		}
	}
};
(function () {
	const css = document.createElement("style");
	css.innerHTML = `
		.tui.wrapper {
			// background: #123456;
			background: rgba(18, 52, 86, 0.9);
			padding: 0.6em;
			position: absolute;
			max-height: 97%;
			overflow: auto;
			right: 0;
			top: 0;
			border-bottom-left-radius: 0.3em;
			z-index: 9;
		}
		.tui * {
			font-size: 14px;
			font-family: monospace;
			padding: 0;
			margin: 0;
			color: white;
			box-sizing: border-box;
		}
		.tui.title {
			margin: 0.6em;
		}
		.tui.type {
			display: inline-block;
			color: magenta;

			border: 1px currentColor solid;
			border-radius: 0.3em;
			padding: 0.3em;
			font-size: 1em;
			margin-left: auto;
		}
		.tui.node[data-expanded="true"] > .tui.header > .tui.refresh {
			opacity: 1;
		}
		.tui.refresh {
			cursor: pointer;
			opacity: 0;
			font-weight: 800;
			width: 1em;
			height: 1em;
			display: inline-flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			margin-right: 3em;
			position: relative;
			font-size: 1.4em;
			top: 0.05em;
			transition: 200ms;
			transform: rotateZ(0);
		}
		.tui.toggle {
			text-shadow: 1px 0px 0px white;
			border: 1px gray solid;
			border-radius: 0.3em;
			cursor: pointer;
			font-weight: 800;
			width: 2em;
			height: 2em;
			display: inline-block;
			text-align: center;
			padding-top: 0.3em;
		}
		.tui.toggle[data-expanded="true"] {
			transform: rotateZ(90deg);
		}
		.tui.toggle:hover {
			color: gray;
		}
		.tui.refresh:hover {
			color: gray;
			transform: rotateZ(360deg);
		}
		.tui.content {
			margin-left: 1em;
			padding-left: 1em;
			border-left: 1px gray solid;
		}
		.tui.title {
			display: inline-block;
		}
		.tui.header {
			display: inline-block;
		}
		.tui.node {
			box-shadow: -1px 1px 2px black;
			padding: 0.6em 0.6em;
			border-radius: 0.3em;
		}
		.tui.node[data-leaf="true"] {
			
		}
		.tui.node[data-leaf="true"] .content {
			display: inline-block;
		}
		.tui.node[data-leaf="true"] {
			
		}
		.leaf {
			display: inline-block;
		}
		input.tui[type="checkbox"] {
			appearance: none;
			display: inline-block;
			width: 3em;
			height: 1.5em;
			border: none;
			background: #000;
			position: relative;
			border-radius: 0.75em;
			transition: 200ms;
		}
		input.tui[type="checkbox"]::before {
			content: "";
			position: absolute;
			display: block;
			left: 0;
			top: 0;
			width: 1.5em;
			height: 1.5em;
			background: white;
			border-radius: 0.75em;
			transition: 200ms;
		}
		input.tui[type="checkbox"]:checked::before {
			left: 1.5em;
		}
		input.tui[type="checkbox"]:checked {
			background: cyan;
		}
		input.tui {
			background: transparent;
			border: none;
			border-bottom: 1px currentColor solid;
			font-family: monospace;
			outline: none; 
			text-align: right;
			padding: 0.3em;
			margin-left: 1em;
		}
		.tui.leaf {
			margin-left: auto;
		}
		.tui.number, .tui.null {
			display: inline;
			color: cyan;
		}
		.tui.string {
			display: inline;
			color: gold;
		}
		.tui.function {
			font-style: italic;
			color: skyblue;
			font-family: monospace;
			font-weight: bold;
			display: inline-block;
		}
		.tui.header {
			min-height: 3em;
			/*border-bottom: 1px gray solid;*/
			display: flex;
			flex-direction: row;
			align-items: center;
		}
	`;
	document.head.appendChild(css);
})();
TreeUI.Node = class Node {
	constructor(name, value, chain, parent) {
		this.name = name;
		this.value = value;
		this.chain = [...chain, name];
		this.parent = parent;
		this.node = document.createElement("div");
		this.node.className = "tui node";
		this.node.dataset.expanded = false;
		this.header = document.createElement("div");
		this.header.className = "tui header";
		this.title = document.createElement("div");
		this.title.className = "tui title";
		this.title.title = this.chain.join(".");
		this.title.innerText = this.name;
		this.node.appendChild(this.header);
		this.leaf = !((typeof value === "object" && value !== null) || typeof value === "undefined");
		this.node.dataset.leaf = this.leaf;
		this.content = document.createElement("div");
		this.content.className = "tui content";
		if (this.leaf) {
			this.leafNode = document.createElement("div");
			this.leafNode.className = "tui leaf";
			this.leafNode.appendChild(TreeUI.stringify(this.value, this.parent, this.name));
			this.header.appendChild(this.title);
			this.header.appendChild(this.leafNode);
		} else {
			this.refresh = document.createElement("div");
			this.refresh.className = "tui refresh";
			this.refresh.title = "Re-evaluate Object Properties";
			this.refresh.innerText = String.fromCharCode(10227);
			this.refresh.onclick = function () {
				if (this.node.dataset.expanded === "true") this.expand();
			}.bind(this);
			this.type = document.createElement("div");
			this.type.innerText = value.constructor.name;
			this.type.className = "tui type";
			this.dropDown = document.createElement("div");
			this.dropDown.className = "tui dropdown";
			this.toggle = document.createElement("div");
			this.toggle.className = "tui toggle";
			this.toggle.dataset.expanded = false;
			this.toggle.innerText = ">";
			this.toggle.onclick = function () {
				if (this.toggle.dataset.expanded === "true") this.close();
				else this.expand();
			}.bind(this);
			this.header.appendChild(this.toggle);
			this.header.appendChild(this.title);
			this.header.appendChild(this.refresh);
			this.header.appendChild(this.type);
			this.content.appendChild(this.dropDown);
		}
		this.node.appendChild(this.content);
	}
	close() {
		this.node.dataset.expanded = false;
		this.toggle.dataset.expanded = false;
		this.dropDown.innerHTML = "";
	}
	expand() {
		this.node.dataset.expanded = true;
		this.toggle.dataset.expanded = true;
		this.dropDown.innerHTML = "";
		for (let key in this.value) if (this.value[key] !== null) {
			let n = new TreeUI.Node(key, this.value[key], this.chain, this.value);
			this.dropDown.appendChild(n.node);
		}
	}
	insert(parent) {
		let wrapper = document.createElement("div");
		wrapper.className = "tui wrapper";
		wrapper.appendChild(this.node);
		parent.appendChild(wrapper);
	}
};

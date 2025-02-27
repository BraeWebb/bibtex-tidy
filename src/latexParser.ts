export class BlockNode {
	type = 'block' as const;
	constructor(
		public kind: 'root' | 'square' | 'curly',
		public parent?: BlockNode | CommandNode,
		public children: (TextNode | CommandNode | BlockNode)[] = []
	) {
		if (parent instanceof BlockNode) {
			parent.children.push(this);
		} else if (parent instanceof CommandNode) {
			parent.args.push(this);
		}
	}
}
export class TextNode {
	type = 'text' as const;
	constructor(public parent: BlockNode, public text: string = '') {
		parent.children.push(this);
	}
}
export class CommandNode {
	type = 'command' as const;
	constructor(
		public parent: BlockNode,
		public command: string = '',
		public args: BlockNode[] = []
	) {
		parent.children.push(this);
	}
}

type Node = BlockNode | TextNode | CommandNode;

export function parseLaTeX(input: string): BlockNode {
	const rootNode = new BlockNode('root');
	let node: Node = rootNode;
	for (let i = 0; i < input.length; i++) {
		const char = input[i];

		switch (node.type) {
			case 'block': {
				if (char === '\\') {
					node = new CommandNode(node);
				} else if (char === '{') {
					node = new BlockNode('curly', node);
				} else if (
					((char === '}' && node.kind === 'curly') ||
						(char === ']' && node.kind === 'square')) &&
					node.parent
				) {
					node = node.parent;
				} else {
					node = new TextNode(node, char);
				}
				break;
			}

			case 'text': {
				if (char === '\\' || char === '{') {
					node = node.parent;
					i--; // repeat
				} else if (
					(char === '}' && node.parent.kind === 'curly') ||
					(char === ']' && node.parent.kind === 'square')
				) {
					node = node.parent;
					i--;
				} else {
					if (char === '}') {
						console.log(node.parent);
					}
					node.text += char;
				}
				break;
			}

			case 'command': {
				if (char === '{') {
					node = new BlockNode('curly', node);
				} else if (char === '[') {
					node = new BlockNode('square', node);
				} else if (node.args.length === 0) {
					node.command += char;
				} else {
					node = node.parent;
					i--;
				}
			}
		}
	}
	return rootNode;
}

export function stringifyLaTeX(ast: BlockNode): string {
	return stringifyBlock(ast);
}

function stringifyBlock(block: BlockNode): string {
	const content = block.children
		.map((node) => {
			switch (node.type) {
				case 'block':
					return stringifyBlock(node);
				case 'command':
					return stringifyCommand(node);
				case 'text':
					return node.text;
			}
		})
		.join('');
	switch (block.kind) {
		case 'root':
			return content;
		case 'curly':
			return '{' + content + '}';
		case 'square':
			return '[' + content + ']';
	}
}

function stringifyCommand(node: CommandNode): string {
	return '\\' + node.command + node.args.map(stringifyBlock).join('');
}

/**
 * Removes any curly braces, unless part of a command.
 */
export function flattenLaTeX(block: BlockNode): BlockNode {
	const newBlock: BlockNode = { ...block, children: [] };
	for (const child of block.children) {
		if (child.type === 'block' && child.kind === 'curly') {
			const newChild = flattenLaTeX(child);
			newBlock.children.push(...newChild.children);
		} else {
			newBlock.children.push(child);
		}
	}
	return newBlock;
}

<script lang="ts">
	import Option from './Option.svelte';
	import type { OptionsNormalized } from '../optionUtils';
	import { DEFAULT_FIELD_SORT, DEFAULT_SORT } from '../optionDefinitions';
	import Collapsible from './Collapsible.svelte';

	export let options: OptionsNormalized;

	let sortFieldsChecked =
		options.sortFields !== undefined && options.sortFields.length > 0;
	let sortFieldsValue = (options.sortFields ?? DEFAULT_FIELD_SORT).join(' ');

	let sortChecked = options.sort !== undefined && options.sort.length > 0;
	let sortValue = (options.sort ?? DEFAULT_SORT).join(' ');

	$: {
		options.sortFields =
			sortFieldsChecked && sortFieldsValue.length > 0
				? sortFieldsValue.split(/[\n\t ,]+/)
				: undefined;
		options.sort =
			sortChecked && sortValue.length > 0
				? sortValue.split(/[\n\t ,]+/)
				: undefined;
	}
</script>

<Collapsible title="Sorting" open={true}>
	<Option option="sort" bind:checked={sortChecked}>
		Fields to sort by: <br />
		<textarea name="sortList" spellcheck="false" bind:value={sortValue} /><br />
		Space delimited, e.g: <code>key type publisher author</code>. For descending
		order, prefix the field name with a dash, e.g.
		<code>-year author</code>.
	</Option>

	<Option option="sortFields" bind:checked={sortFieldsChecked}>
		Field order: <br />
		<textarea
			name="sortFieldList"
			spellcheck="false"
			bind:value={sortFieldsValue}
		/>
		<br />
		Space delimited, e.g: <code>title author year</code>
	</Option>
</Collapsible>

<style>
</style>

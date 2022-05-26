<template>
    <form>
        <label>
            String
            <input v-model="stringQuery" type="text">
        </label>

        <label>
            Integer
            <input v-model.number="integerQuery" type="number">
        </label>

        <label>
            Boolean
            <input v-model="booleanQuery" type="checkbox">
        </label>

        <label>
            Enum
            <select v-model="enumQuery">
                <option></option>
                <option value="a">A</option>
                <option value="b">B</option>
                <option value="c">C</option>
            </select>
        </label>
    </form>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    import { useRouteQuery, enumTransformer, integerTransformer, booleanTransformer } from 'vue-use-route-query/src';

    enum Enum {
        A = 'a',
        B = 'b',
        C = 'c'
    }

    export default defineComponent({
        name: 'Main',
        setup() {
            const stringQuery = useRouteQuery('string', '');
            const integerQuery = useRouteQuery('integer', 0, integerTransformer);
            const booleanQuery = useRouteQuery('boolean', false, booleanTransformer);
            const enumQuery = useRouteQuery('enum', null, enumTransformer(Enum));

            return {
                stringQuery,
                integerQuery,
                booleanQuery,
                enumQuery,
            };
        },
    });
</script>

<style scoped>

</style>

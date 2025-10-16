<x-dynamic-component
    :component="$getFieldWrapperView()"
    :field="$field"
>
    <div
        {{ $getExtraAttributeBag() }}
    >
        {{ $getContent() }}
    </div>
</x-dynamic-component>

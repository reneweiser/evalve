<x-dynamic-component
    :component="$getFieldWrapperView()"
    :field="$field"
>
    <div
        {{ $getExtraAttributeBag() }}
    >
        <p>{{ $getQuestion() }}</p>
        <x-filament::button>
            Frage stellen
        </x-filament::button>
    </div>
</x-dynamic-component>

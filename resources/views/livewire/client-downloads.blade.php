<x-filament-widgets::widget>
    <x-filament::section>
        <x-filament::link :href="$link">Download Client App</x-filament::link>
    </x-filament::section>
    <x-filament::card>
        <div>
            {{ $this->updateClientAction }}

            <x-filament-actions::modals />
        </div>
    </x-filament::card>
</x-filament-widgets::widget>

<x-filament-panels::page>
    <form wire:submit="submit" class="fi-sc-form">
        {{ $this->form }}

        <div class="fi-ac fi-align-start">
            <x-filament::button type="submit">
                Submit
            </x-filament::button>
        </div>
    </form>
</x-filament-panels::page>

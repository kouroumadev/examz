<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePracticeResultDoTempsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('practice_result_do_temps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('practice_result_dtemp_id')->constrained('practice_result_dtemps')->onDelete('cascade');
            $table->foreignId('practice_option_id')->constrained('practice_options')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('practice_result_do_temps');
    }
}

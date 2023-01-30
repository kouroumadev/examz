<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateExamResultDoTempsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('exam_result_do_temps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_result_dtemp_id')->constrained('exam_result_dtemps')->onDelete('cascade');
            $table->foreignId('exam_option_id')->constrained('exam_options')->onDelete('cascade');
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
        Schema::dropIfExists('exam_result_do_temps');
    }
}
